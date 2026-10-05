from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView
from django.http import JsonResponse, FileResponse, Http404
from django.db.models import Q, F, Sum, Avg
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import user_passes_test
from .models import App, AppDemand, CATEGORY_CHOICES
from .forms import AppUploadForm, AppDemandForm
import os

def staff_required(view_func):
    """Decorator ensuring only authenticated admin/staff can access /admin/manage/"""
    decorated_view = user_passes_test(
        lambda u: u.is_authenticated and (u.is_staff or u.is_superuser),
        login_url='/admin/manage/login/'
    )(view_func)
    return decorated_view


# ==========================================
# PUBLIC USER VIEWS (localhost:8000/)
# ==========================================

class AppCatalogView(ListView):
    """
    Public User Storefront - Exactly 18 apps per page with pagination
    Strictly displays public uploaded apps and 'Ask for App' intake
    """
    model = App
    template_name = 'store/index.html'
    context_object_name = 'apps'
    paginate_by = 18

    def get_queryset(self):
        queryset = App.objects.filter(is_published=True)
        category = self.request.GET.get('category')
        query = self.request.GET.get('q')

        if category and category != 'All':
            queryset = queryset.filter(category=category)
        if query:
            queryset = queryset.filter(
                Q(app_name__icontains=query) |
                Q(developer_name__icontains=query) |
                Q(package_name__icontains=query)
            )
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = ['All'] + [c[0] for c in CATEGORY_CHOICES]
        context['current_category'] = self.request.GET.get('category', 'All')
        context['search_query'] = self.request.GET.get('q', '')
        context['featured_apps'] = App.objects.filter(is_published=True).order_by('-is_featured', '-rating')[:4]
        context['total_apps_count'] = App.objects.filter(is_published=True).count()
        return context


def live_search_ajax(request):
    """Instant AJAX search endpoint matching user input without page reloads"""
    query = request.GET.get('term', '').strip()
    if len(query) < 1:
        return JsonResponse({'results': []})

    matches = App.objects.filter(
        Q(app_name__icontains=query) |
        Q(developer_name__icontains=query) |
        Q(category__icontains=query),
        is_published=True
    )[:8]

    return JsonResponse({'results': [
        {
            'name': a.app_name,
            'package_name': a.package_name,
            'developer': a.developer_name,
            'category': a.category,
            'icon_url': a.app_icon.url if a.app_icon else '',
            'rating': float(a.rating),
            'file_size': a.file_size,
            'detail_url': a.get_absolute_url(),
        } for a in matches
    ]})


class AppDetailView(DetailView):
    """Detailed mobile application profile"""
    model = App
    template_name = 'store/app_detail.html'
    context_object_name = 'app'
    slug_field = 'package_name'
    slug_url_kwarg = 'package_name'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['related_apps'] = App.objects.filter(
            category=self.object.category,
            is_published=True
        ).exclude(id=self.object.id).order_by('-downloads_count')[:6]
        return context


def download_apk(request, package_name):
    """Atomically increment downloads_count and stream APK binary"""
    app = get_object_or_404(App, package_name=package_name, is_published=True)
    if not app.apk_file or not os.path.exists(app.apk_file.path):
        raise Http404("APK file is unavailable on server.")

    App.objects.filter(pk=app.pk).update(downloads_count=F('downloads_count') + 1)
    return FileResponse(
        open(app.apk_file.path, 'rb'),
        as_attachment=True,
        filename=os.path.basename(app.apk_file.name),
        content_type='application/vnd.android.package-archive'
    )


def contact_admin_demand(request):
    """
    Public User Demand Form:
    "Find and ask for your dreaming apps"
    "We are building app on your demand"
    Displays strict legal notice warning against illegal or theft apps.
    """
    if request.method == 'POST':
        form = AppDemandForm(request.POST)
        if form.is_valid():
            demand = form.save()
            messages.success(
                request,
                f"Thank you, {demand.user_name}! Your custom app request for '{demand.app_title}' has been submitted to Hadi88 Apps engineering team."
            )
            return redirect('app_catalog')
    else:
        form = AppDemandForm()

    return render(request, 'store/contact_admin.html', {'form': form})


# ==========================================
# SECURED ADMIN PORTAL (/admin/manage/)
# ==========================================

def admin_login_view(request):
    """Secure Admin Login at /admin/manage/login/"""
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('admin_manage')

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.is_staff or user.is_superuser:
                login(request, user)
                messages.success(request, f"Welcome back, Administrator {user.username}!")
                return redirect('admin_manage')
            else:
                messages.error(request, "Access restricted to staff administrators.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()

    return render(request, 'store/admin_login.html', {'form': form})


def admin_logout_view(request):
    """Admin Logout handler"""
    logout(request)
    messages.info(request, "You have been signed out from the Admin Portal.")
    return redirect('app_catalog')


@staff_required
def admin_dashboard(request):
    """
    Custom Secured Route: /admin/manage/
    Full administrative control: Publish apps, edit apps, delete apps, manage client demands.
    """
    apps = App.objects.all().order_by('-created_at')
    demands = AppDemand.objects.all().order_by('-created_at')

    stats = {
        'total_apps': apps.count(),
        'total_downloads': apps.aggregate(total=Sum('downloads_count'))['total'] or 0,
        'avg_rating': round(apps.aggregate(avg=Avg('rating'))['avg'] or 0, 2),
        'pending_demands': demands.filter(status='Pending').count(),
    }

    upload_form = AppUploadForm()
    return render(request, 'store/admin_dashboard.html', {
        'apps': apps,
        'demands': demands,
        'stats': stats,
        'upload_form': upload_form,
    })


@staff_required
def admin_publish_app(request):
    """Publish a new mobile application binary and metadata"""
    if request.method == 'POST':
        form = AppUploadForm(request.POST, request.FILES)
        if form.is_valid():
            app = form.save()
            messages.success(request, f"Successfully published '{app.app_name}' (v{app.version}) to Hadi88 Store!")
            return redirect('admin_manage')
        else:
            messages.error(request, "Please correct the form errors below.")
    return redirect('admin_manage')


@staff_required
def admin_edit_app(request, pk):
    """Update existing application details or APK version"""
    app = get_object_or_404(App, pk=pk)
    if request.method == 'POST':
        form = AppUploadForm(request.POST, request.FILES, instance=app)
        if form.is_valid():
            form.save()
            messages.success(request, f"Updated '{app.app_name}' details.")
            return redirect('admin_manage')
    return redirect('admin_manage')


@staff_required
def admin_delete_app(request, pk):
    """Delete application from store"""
    app = get_object_or_404(App, pk=pk)
    app_name = app.app_name
    app.delete()
    messages.success(request, f"Application '{app_name}' removed from store.")
    return redirect('admin_manage')


@staff_required
def admin_update_demand_status(request, pk):
    """Update status of client on-demand app request"""
    demand = get_object_or_404(AppDemand, pk=pk)
    new_status = request.POST.get('status')
    if new_status in dict(DEMAND_STATUS_CHOICES):
        demand.status = new_status
        demand.save()
        messages.success(request, f"Demand '{demand.app_title}' marked as '{new_status}'.")
    return redirect('admin_manage')


@staff_required
def admin_delete_demand(request, pk):
    """Delete client app demand"""
    demand = get_object_or_404(AppDemand, pk=pk)
    demand.delete()
    messages.success(request, "Demand request deleted.")
    return redirect('admin_manage')
