from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^images/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR, 'public', 'images')}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR, 'static')}),
]

