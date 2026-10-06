from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    # ----------------------------------------------------
    # 1. PUBLIC USERS ACCESS (localhost:8000/)
    # Only browsing apps, searching, and submitting demands
    # ----------------------------------------------------
    path('', views.AppCatalogView.as_view(), name='app_catalog'),
    path('api/search/', views.live_search_ajax, name='live_search_ajax'),
    
    # Changed <slug:> to <str:> to allow dots (.) in package names:
    path('app/<str:package_name>/', views.AppDetailView.as_view(), name='app_detail'),
    path('app/<str:package_name>/download/', views.download_apk, name='download_apk'),
    
    path('ask-for-app/', views.contact_admin_demand, name='contact_admin_demand'),

    # ----------------------------------------------------
    # 2. SECURED CUSTOM ADMIN ROUTE: /admin/manage/
    # Dedicated secure login and fully administrative portal
    # ----------------------------------------------------
    path('admin/manage/login/', views.admin_login_view, name='admin_login'),
    path('admin/manage/logout/', views.admin_logout_view, name='admin_logout'),
    path('admin/manage/', views.admin_dashboard, name='admin_manage'),
    path('admin/manage/publish/', views.admin_publish_app, name='admin_publish_app'),
    path('admin/manage/app/<int:pk>/edit/', views.admin_edit_app, name='admin_edit_app'),
    path('admin/manage/app/<int:pk>/delete/', views.admin_delete_app, name='admin_delete_app'),
    path('admin/manage/demand/<int:pk>/status/', views.admin_update_demand_status, name='admin_update_demand_status'),
    path('admin/manage/demand/<int:pk>/delete/', views.admin_delete_demand, name='admin_delete_demand'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
