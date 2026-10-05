import { DjangoFile } from '../types/app';

export const DJANGO_FILES: DjangoFile[] = [
  {
    name: 'models.py',
    path: 'store/models.py',
    language: 'python',
    description: 'Django ORM App & AppDemand models with validation, slug generation, and client demand logging',
    content: `from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
import os

CATEGORY_CHOICES = [
    ('Games', 'Games'),
    ('Productivity', 'Productivity'),
    ('Tools', 'Tools'),
    ('Social', 'Social'),
    ('Entertainment', 'Entertainment'),
    ('Finance', 'Finance'),
    ('Photography', 'Photography'),
    ('Health & Fitness', 'Health & Fitness'),
]

DEMAND_STATUS_CHOICES = [
    ('Pending', 'Pending Review'),
    ('In Review', 'In Review'),
    ('Approved', 'Approved'),
    ('In Development', 'In Development'),
    ('Rejected', 'Rejected'),
]

PLATFORM_CHOICES = [
    ('Android', 'Android (APK)'),
    ('iOS', 'iOS (Swift)'),
    ('Cross-Platform', 'Cross-Platform (Flutter / React Native)'),
    ('Web App', 'Web Application / PWA'),
]

def app_icon_upload_path(instance, filename):
    return f"icons/{instance.package_name}/{filename}"

def app_banner_upload_path(instance, filename):
    return f"banners/{instance.package_name}/{filename}"

def apk_upload_path(instance, filename):
    return f"apks/{instance.package_name}/{filename}"


class App(models.Model):
    """
    Hadi88 Apps - Core Application Model
    """
    app_name = models.CharField(max_length=150, verbose_name="Application Name")
    package_name = models.SlugField(max_length=150, unique=True, verbose_name="Package Name (Slug)")
    developer_name = models.CharField(max_length=120, default="Hadi88 Studio", verbose_name="Developer Name")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Tools', db_index=True)
    app_icon = models.ImageField(upload_to=app_icon_upload_path, verbose_name="App Icon (512x512)")
    banner_image = models.ImageField(upload_to=app_banner_upload_path, blank=True, null=True, verbose_name="Featured Banner (16:9)")
    description = models.TextField(verbose_name="Full Description")
    version = models.CharField(max_length=20, default="1.0.0", verbose_name="Version")
    apk_file = models.FileField(
        upload_to=apk_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['apk', 'xapk', 'zip'])],
        verbose_name="APK Binary Package"
    )
    file_size = models.CharField(max_length=20, default="25 MB", verbose_name="File Size (e.g. 45 MB)")
    downloads_count = models.PositiveIntegerField(default=0, db_index=True, verbose_name="Total Downloads")
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=4.50,
        validators=[MinValueValidator(1.00), MaxValueValidator(5.00)],
        verbose_name="Rating (1.00 - 5.00)"
    )
    is_featured = models.BooleanField(default=False, help_text="Showcase in hero carousel")
    is_published = models.BooleanField(default=True, help_text="Publicly visible in store")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-downloads_count', '-created_at']
        verbose_name = "Application"
        verbose_name_plural = "Applications"

    def __str__(self):
        return f"{self.app_name} (v{self.version}) - {self.developer_name}"

    def save(self, *args, **kwargs):
        if not self.package_name:
            self.package_name = f"com.hadi88.{slugify(self.app_name).replace('-', '')}"
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('app_detail', kwargs={'package_name': self.package_name})

    @property
    def formatted_downloads(self):
        if self.downloads_count >= 1_000_000:
            return f"{self.downloads_count / 1_000_000:.1f}M+"
        elif self.downloads_count >= 1_000:
            return f"{self.downloads_count / 1_000:.0f}K+"
        return str(self.downloads_count)


class AppDemand(models.Model):
    """
    Hadi88 Apps - On-Demand Custom App Requests from Users
    "Find and ask for your dreaming apps"
    "We are building app on your demand"
    """
    user_name = models.CharField(max_length=120, verbose_name="User Name")
    email = models.EmailField(verbose_name="User Email")
    contact_method = models.CharField(
        max_length=20, 
        choices=[('Email', 'Email'), ('WhatsApp', 'WhatsApp'), ('Telegram', 'Telegram')],
        default='Email'
    )
    contact_handle = models.CharField(max_length=100, blank=True, verbose_name="Phone / Username Handle")
    app_title = models.CharField(max_length=150, verbose_name="Dreaming App Concept Title")
    platform = models.CharField(max_length=30, choices=PLATFORM_CHOICES, default='Android')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Productivity')
    requirements = models.TextField(verbose_name="Detailed App Requirements & Workflows")
    timeline = models.CharField(max_length=50, default="2-4 Weeks", verbose_name="Desired Delivery Timeline")
    budget = models.CharField(max_length=50, default="$1,000 - $3,000", verbose_name="Estimated Budget")
    status = models.CharField(max_length=30, choices=DEMAND_STATUS_CHOICES, default='Pending', db_index=True)
    legal_policy_agreed = models.BooleanField(
        default=False,
        help_text="User strictly affirmed that requested app contains no illegal, pirated, or theft material."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Client App Demand"
        verbose_name_plural = "Client App Demands"

    def __str__(self):
        return f"{self.app_title} by {self.user_name} [{self.status}]"
`
  },
  {
    name: 'settings.py',
    path: 'appstore_project/settings.py',
    language: 'python',
    description: 'Django settings for Hadi88 Apps with dark chocolate theme & pagination',
    content: `"""
Django settings for Hadi88 Apps - "Find and ask for your dreaming apps"
"We are building app on your demand"
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-hadi88-apps-secure-production-key-2026')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Hadi88 Apps Core Store application
    'store.apps.StoreConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'appstore_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'appstore_project.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Store pagination requirement: Exactly 18 apps per page
APPS_PER_PAGE = 18
DATA_UPLOAD_MAX_MEMORY_SIZE = 150 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 150 * 1024 * 1024
`
  },
  {
    name: 'forms.py',
    path: 'store/forms.py',
    language: 'python',
    description: 'Forms for publishing apps and submitting custom on-demand app requests with warning compliance',
    content: `from django import forms
from .models import App, AppDemand

GLASS_INPUT_CLASS = (
    "w-full bg-[#18120e]/90 text-amber-50 placeholder-stone-500 text-xs sm:text-sm "
    "rounded-xl border border-amber-500/20 px-4 py-3 focus:outline-none "
    "focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all min-h-[44px]"
)

GLASS_SELECT_CLASS = (
    "w-full bg-[#18120e] text-amber-50 text-xs sm:text-sm rounded-xl border "
    "border-amber-500/20 px-4 py-3 focus:outline-none focus:border-amber-500 "
    "transition-all cursor-pointer min-h-[44px]"
)

class AppUploadForm(forms.ModelForm):
    """Admin form to publish or update an APK package"""
    class Meta:
        model = App
        fields = [
            'app_name', 'package_name', 'developer_name', 'category',
            'version', 'file_size', 'rating', 'app_icon', 'banner_image',
            'apk_file', 'description', 'is_featured', 'is_published'
        ]
        widgets = {
            'app_name': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'e.g., Aether Strike'}),
            'package_name': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'e.g., com.hadi88.aether'}),
            'developer_name': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'Hadi88 Studio'}),
            'category': forms.Select(attrs={'class': GLASS_SELECT_CLASS}),
            'version': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': '1.0.0'}),
            'file_size': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': '45 MB'}),
            'rating': forms.NumberInput(attrs={'class': GLASS_INPUT_CLASS, 'step': '0.1', 'min': '1.0', 'max': '5.0'}),
            'description': forms.Textarea(attrs={'class': GLASS_INPUT_CLASS, 'rows': 4}),
            'is_featured': forms.CheckboxInput(attrs={'class': 'w-5 h-5 accent-amber-500 rounded'}),
            'is_published': forms.CheckboxInput(attrs={'class': 'w-5 h-5 accent-amber-500 rounded'}),
        }


class AppDemandForm(forms.ModelForm):
    """
    Client On-Demand Form:
    "Find and ask for your dreaming apps"
    "We are building app on your demand"
    With mandatory legal compliance check.
    """
    legal_policy_agreed = forms.BooleanField(
        required=True,
        label="I confirm that my requested application is completely legal, non-infringing, and contains no theft, cracking, or illicit material."
    )

    class Meta:
        model = AppDemand
        fields = [
            'user_name', 'email', 'contact_method', 'contact_handle',
            'app_title', 'platform', 'category', 'requirements',
            'timeline', 'budget', 'legal_policy_agreed'
        ]
        widgets = {
            'user_name': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'Your Full Name'}),
            'email': forms.EmailInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'name@example.com'}),
            'contact_method': forms.Select(attrs={'class': GLASS_SELECT_CLASS}),
            'contact_handle': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'WhatsApp / Telegram / Phone'}),
            'app_title': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'Your Dreaming App Concept Name'}),
            'platform': forms.Select(attrs={'class': GLASS_SELECT_CLASS}),
            'category': forms.Select(attrs={'class': GLASS_SELECT_CLASS}),
            'requirements': forms.Textarea(attrs={
                'class': GLASS_INPUT_CLASS,
                'rows': 4,
                'placeholder': 'Explain your requirements: features, database needs, user authentication, third-party APIs...'
            }),
            'timeline': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'e.g. 2-4 Weeks'}),
            'budget': forms.TextInput(attrs={'class': GLASS_INPUT_CLASS, 'placeholder': 'e.g. $1,000 - $3,000'}),
            'legal_policy_agreed': forms.CheckboxInput(attrs={'class': 'w-5 h-5 accent-amber-500 rounded mt-0.5'}),
        }
`
  },
  {
    name: 'views.py',
    path: 'store/views.py',
    language: 'python',
    description: 'Views for 18-item catalog pagination, live search, app details, APK download, and client app demands',
    content: `from django.shortcuts import render, get_object_or_404, redirect
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
`
  },
  {
    name: 'urls.py',
    path: 'store/urls.py',
    language: 'python',
    description: 'Routing for catalog, AJAX live search, detail view, APK downloads, and Contact Admin demand view',
    content: `from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    # Catalog (18 items per page)
    path('', views.AppCatalogView.as_view(), name='app_catalog'),

    # Live AJAX Search Endpoint
    path('api/search/', views.live_search_ajax, name='live_search_ajax'),

    # Detail View & Direct Download
    path('app/<slug:package_name>/', views.AppDetailView.as_view(), name='app_detail'),
    path('app/<slug:package_name>/download/', views.download_apk, name='download_apk'),

    # Contact Admin / Ask for Your Dreaming App
    path('ask-for-app/', views.contact_admin_demand, name='contact_admin_demand'),

    # Admin Management Dashboard
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
`
  },
  {
    name: 'base.html',
    path: 'templates/store/base.html',
    language: 'html',
    description: 'Base responsive template with Hadi88 Apps branding, mobile navigation drawer, and live search bar',
    content: `{% load static %}
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}Hadi88 Apps - Find and Ask for Your Dreaming Apps{% endblock %}</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            amber: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
            choco: { 950: '#0d0a08', 900: '#140f0c', 850: '#1a130f', 800: '#231b15' }
          }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0d0a08; color: #f7efe6; }
    h1, h2, h3, .font-display { font-family: 'Syne', sans-serif; }
    .glass-panel { background: rgba(22, 17, 13, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(245, 158, 11, 0.15); }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-[#0d0a08] text-[#f7efe6]">

  <!-- Top Header Navigation -->
  <header class="sticky top-0 z-50 glass-panel border-b border-amber-500/15">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
      
      <!-- Brand Logo & Tagline -->
      <a href="{% url 'app_catalog' %}" class="flex items-center gap-3 shrink-0">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-display font-black text-xl shadow-lg shadow-amber-500/20">
          H
        </div>
        <div class="flex flex-col">
          <span class="font-display font-extrabold text-xl sm:text-2xl text-white">
            Hadi88<span class="text-amber-400 ml-1">Apps</span>
          </span>
          <span class="hidden lg:block text-[10px] text-amber-300/80">Find and ask for your dreaming apps</span>
        </div>
      </a>

      <!-- Live Search Bar -->
      <div class="relative flex-1 max-w-md mx-2">
        <input 
          type="text" 
          id="live-search-input"
          placeholder="Search apps, games, tools..." 
          class="w-full bg-[#18120e]/90 text-xs sm:text-sm text-amber-100 placeholder-stone-400 rounded-full pl-10 pr-4 py-2.5 border border-amber-500/20 focus:outline-none focus:border-amber-400 min-h-[44px]"
        />
        <div id="live-search-results" class="hidden absolute top-full mt-2 w-full glass-panel rounded-2xl p-2 shadow-2xl z-50 max-h-80 overflow-y-auto"></div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex items-center gap-2">
        <a href="{% url 'contact_admin_demand' %}" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 transition-all min-h-[44px] flex items-center gap-1.5">
          <span>Ask for App</span>
        </a>
        <a href="{% url 'admin_dashboard' %}" class="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold glass-panel text-stone-300 hover:text-white min-h-[44px]">
          Admin Panel
        </a>
      </nav>

    </div>
  </header>

  <!-- Flash Messages -->
  {% if messages %}
  <div class="max-w-7xl mx-auto px-4 mt-4 w-full">
    {% for message in messages %}
    <div class="p-4 rounded-xl border bg-emerald-950/40 border-emerald-500/30 text-emerald-300 text-xs sm:text-sm">
      {{ message }}
    </div>
    {% endfor %}
  </div>
  {% endif %}

  <!-- Main Viewport -->
  <main class="flex-1">
    {% block content %}{% endblock %}
  </main>

  <!-- Footer -->
  <footer class="mt-20 border-t border-amber-500/15 bg-[#0a0705] py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-400 space-y-2">
      <div class="font-display font-bold text-white text-base">Hadi88 Apps</div>
      <p>"Find and ask for your dreaming apps" · "We are building app on your demand"</p>
      <p class="text-[11px] text-stone-600">Strict safety: We never develop any illegal, theft, or piracy category software.</p>
    </div>
  </footer>

</body>
</html>
`
  },
  {
    name: 'contact_admin.html',
    path: 'templates/store/contact_admin.html',
    language: 'html',
    description: 'Demand an app form page with strict legal policy warning and user requirement submission',
    content: `{% extends 'store/base.html' %}

{% block title %}Ask for Your Dreaming App - Hadi88 Apps{% endblock %}

{% block content %}
<div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

  <!-- Header -->
  <div class="glass-panel rounded-3xl p-6 sm:p-8 space-y-2 text-center border border-amber-500/20">
    <div class="text-xs font-bold text-amber-400 uppercase tracking-wider">Hadi88 Apps On-Demand Engineering</div>
    <h1 class="text-2xl sm:text-4xl font-display font-extrabold text-white">Find and Ask for Your Dreaming Apps</h1>
    <p class="text-xs sm:text-sm text-amber-200/80 font-medium">"We are building app on your demand"</p>
  </div>

  <!-- STRICT POLICY WARNING BOX -->
  <div class="rounded-2xl bg-red-950/30 border border-red-500/40 p-5 space-y-2 text-xs">
    <div class="font-bold text-red-300 uppercase tracking-wide text-xs flex items-center gap-2">
      <span>⚠️ Strict Policy & Legal Notice</span>
    </div>
    <p class="text-red-200/90 leading-relaxed font-medium">
      <strong>We do not build any illegal, pirated, modded, gambling, adult, hacking, or theft category applications.</strong>
      In such cases, we will <strong>never reply to spam emails, fraudulent messages, or illicit solicitations</strong>. Our decision is final.
    </p>
  </div>

  <!-- Demand Submission Form -->
  <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/20">
    <form method="POST" class="space-y-4">
      {% csrf_token %}
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">Your Full Name *</label>
          {{ form.user_name }}
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">Email Address *</label>
          {{ form.email }}
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">Contact Method</label>
          {{ form.contact_method }}
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">WhatsApp / Phone / Username</label>
          {{ form.contact_handle }}
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-amber-500/10">
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">Dreaming App Name *</label>
          {{ form.app_title }}
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">Target Platform</label>
          {{ form.platform }}
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">Category</label>
          {{ form.category }}
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-stone-300 mb-1">Detailed Requirements & Features *</label>
        {{ form.requirements }}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">Desired Timeline</label>
          {{ form.timeline }}
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-1">Budget Range</label>
          {{ form.budget }}
        </div>
      </div>

      <div class="p-4 rounded-xl bg-[#1b140f] border border-amber-500/20 flex items-start gap-3">
        {{ form.legal_policy_agreed }}
        <label class="text-xs text-stone-300 leading-relaxed cursor-pointer">
          I confirm that my proposed app contains no illegal, pirated, or theft material, and I accept Hadi88 Apps safety standards.
        </label>
      </div>

      <div class="pt-3 flex justify-end">
        <button type="submit" class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/25">
          Submit App Demand to Admin
        </button>
      </div>
    </form>
  </div>

</div>
{% endblock %}
`
  },
  {
    name: 'index.html',
    path: 'templates/store/index.html',
    language: 'html',
    description: 'Homepage template featuring 18-app pagination, category tabs, and hero spotlight with Hadi88 Apps taglines',
    content: `{% extends 'store/base.html' %}

{% block content %}
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

  <!-- Hero Spotlight -->
  {% if featured_apps %}
  <section class="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/20 relative overflow-hidden">
    {% with hero=featured_apps.0 %}
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-7 space-y-4">
        <div class="text-xs font-bold text-amber-400 uppercase tracking-wide">
          Hadi88 Apps · "Find and ask for your dreaming apps"
        </div>
        <h1 class="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight">
          {{ hero.app_name }}
        </h1>
        <p class="text-xs sm:text-sm text-stone-300 line-clamp-3 leading-relaxed">
          {{ hero.description }}
        </p>
        <div class="flex items-center gap-3 pt-2">
          <a href="{{ hero.get_absolute_url }}" class="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-xl">
            View Details & Install
          </a>
          <a href="{% url 'contact_admin_demand' %}" class="px-5 py-3 rounded-xl glass-panel text-amber-300 text-xs sm:text-sm font-semibold">
            Ask for Custom App
          </a>
        </div>
      </div>
      <div class="lg:col-span-5">
        <img src="{{ hero.banner_image.url }}" alt="{{ hero.app_name }}" class="w-full h-60 sm:h-72 object-cover rounded-2xl border border-amber-500/20">
      </div>
    </div>
    {% endwith %}
  </section>
  {% endif %}

  <!-- Categories -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg sm:text-xl font-display font-bold text-white">Categories</h2>
      <span class="text-xs text-stone-400">{{ total_apps_count }} apps available</span>
    </div>
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {% for cat in categories %}
      <a href="?category={{ cat }}" class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold {% if current_category == cat %}bg-amber-500 text-black{% else %}glass-panel text-stone-300{% endif %}">
        {{ cat }}
      </a>
      {% endfor %}
    </div>
  </section>

  <!-- 18 Apps Per Page Grid -->
  <section class="space-y-6">
    <div class="flex items-center justify-between border-b border-amber-500/10 pb-3">
      <h2 class="text-xl font-display font-bold text-white">
        {% if current_category != 'All' %}{{ current_category }} Apps{% else %}All Applications{% endif %}
      </h2>
      <span class="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">18 Apps Per Page</span>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {% for app in apps %}
      <div class="glass-panel rounded-2xl p-4 flex flex-col justify-between">
        <div>
          <img src="{{ app.app_icon.url }}" alt="{{ app.app_name }}" class="w-full aspect-square rounded-xl object-cover mb-3">
          <h3 class="font-bold text-xs sm:text-sm text-white truncate">{{ app.app_name }}</h3>
          <p class="text-[11px] text-stone-400 truncate">{{ app.developer_name }}</p>
          <div class="text-[11px] text-amber-400 mt-1">★ {{ app.rating }} · {{ app.file_size }}</div>
        </div>
        <div class="pt-3 mt-3 border-t border-amber-500/10">
          <a href="{% url 'download_apk' app.package_name %}" class="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black text-xs font-bold text-center block">
            Install (APK)
          </a>
        </div>
      </div>
      {% endfor %}
    </div>

    <!-- Pagination Controls -->
    {% if is_paginated %}
    <div class="flex items-center justify-between glass-panel p-4 rounded-2xl text-xs">
      <div>
        {% if page_obj.has_previous %}
        <a href="?page={{ page_obj.previous_page_number }}" class="px-4 py-2 glass-panel rounded-xl text-stone-300">Previous</a>
        {% endif %}
      </div>
      <span class="text-stone-400">Page {{ page_obj.number }} of {{ paginator.num_pages }}</span>
      <div>
        {% if page_obj.has_next %}
        <a href="?page={{ page_obj.next_page_number }}" class="px-4 py-2 glass-panel rounded-xl text-stone-300">Next</a>
        {% endif %}
      </div>
    </div>
    {% endif %}
  </section>

</div>
{% endblock %}
`
  },
  {
    name: 'requirements.txt',
    path: 'requirements.txt',
    language: 'txt',
    description: 'Python packages required for Hadi88 Apps Django deployment',
    content: `Django>=5.0.0,<5.2.0
Pillow>=10.2.0
django-cleanup>=8.0.0
gunicorn>=21.2.0
whitenoise>=6.6.0
`
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    description: 'Hadi88 Apps documentation, taglines, setup instructions, and legal safety policy',
    content: `# Hadi88 Apps - "Find and ask for your dreaming apps"

> **"We are building app on your demand"**

A modern, responsive Django web marketplace replicating the Google Play Store experience with dark chocolate brown & amber glassmorphic design.

## Features
- **18 Apps Per Page**: Strict pagination limit of exactly 18 items per page.
- **Client App Demands**: Dedicated on-demand app request pipeline connecting users with Hadi88 engineers.
- **Strict Compliance Policy**: Zero tolerance for illegal, theft, pirated, or cracked software categories.
- **Live AJAX Search**: Instant search bar in header with keyboard shortcuts.
- **Atomic Downloads**: Fast APK downloads with race-condition-free \`F()\` download counters.

## Quickstart
\`\`\`bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
\`\`\`
`
  }
];
