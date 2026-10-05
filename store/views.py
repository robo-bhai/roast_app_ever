from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView
from django.http import JsonResponse, FileResponse, Http404
from django.db.models import Q, F, Sum, Avg
from django.contrib import messages
from .models import App, AppDemand, CATEGORY_CHOICES
from .forms import AppUploadForm, AppDemandForm
import os

class AppCatalogView(ListView):
    """
    Hadi88 Apps Storefront - Exactly 18 apps per page with pagination
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
    User Demand Form:
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


def admin_dashboard(request):
    """Custom Administrative dashboard with app CRUD & Client Demands review"""
    apps = App.objects.all().order_by('-created_at')
    demands = AppDemand.objects.all().order_by('-created_at')

    stats = {
        'total_apps': apps.count(),
        'total_downloads': apps.aggregate(total=Sum('downloads_count'))['total'] or 0,
        'avg_rating': round(apps.aggregate(avg=Avg('rating'))['avg'] or 0, 2),
        'pending_demands': demands.filter(status='Pending').count(),
    }

    return render(request, 'store/admin_dashboard.html', {
        'apps': apps,
        'demands': demands,
        'stats': stats,
        'upload_form': AppUploadForm(),
    })
