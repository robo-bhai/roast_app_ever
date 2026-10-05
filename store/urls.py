from django.urls import path
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
