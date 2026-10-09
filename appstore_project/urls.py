from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
import os

# Ultra-safe static resolution: checks STATIC_ROOT (staticfiles), static, and public
def safe_static_serve(request, path, insecure=True):
    # Check STATIC_ROOT first (where collectstatic put admin CSS, JS, etc.)
    if settings.STATIC_ROOT and os.path.exists(os.path.join(settings.STATIC_ROOT, path)):
        return serve(request, path, document_root=settings.STATIC_ROOT)
    # Check BASE_DIR / 'static'
    static_dir = os.path.join(settings.BASE_DIR, 'static')
    if os.path.exists(os.path.join(static_dir, path)):
        return serve(request, path, document_root=static_dir)
    # Check BASE_DIR / 'public'
    public_dir = os.path.join(settings.BASE_DIR, 'public')
    if os.path.exists(os.path.join(public_dir, path)):
        return serve(request, path, document_root=public_dir)
    # Fallback to static_dir or STATIC_ROOT
    doc_root = settings.STATIC_ROOT if os.path.exists(settings.STATIC_ROOT) else static_dir
    return serve(request, path, document_root=doc_root)

# Ultra-safe media resolution: checks MEDIA_ROOT, apks, public/images, and static/images
def safe_media_serve(request, path, insecure=True):
    # 1. Standard MEDIA_ROOT
    if os.path.exists(os.path.join(settings.MEDIA_ROOT, path)):
        return serve(request, path, document_root=settings.MEDIA_ROOT)
    # 2. Check if it's an APK requested and exists in apks/
    if path.startswith('apks/'):
        filename = os.path.basename(path)
        apks_dir = os.path.join(settings.BASE_DIR, 'apks')
        if os.path.exists(os.path.join(apks_dir, filename)):
            return serve(request, filename, document_root=apks_dir)
    # 3. Check if file exists in public/images
    clean_filename = os.path.basename(path)
    pub_img = os.path.join(settings.BASE_DIR, 'public', 'images', clean_filename)
    if os.path.exists(pub_img):
        return serve(request, clean_filename, document_root=os.path.join(settings.BASE_DIR, 'public', 'images'))
    # 4. Check if file exists in static/images
    stat_img = os.path.join(settings.BASE_DIR, 'static', 'images', clean_filename)
    if os.path.exists(stat_img):
        return serve(request, clean_filename, document_root=os.path.join(settings.BASE_DIR, 'static', 'images'))
    # Default to MEDIA_ROOT
    return serve(request, path, document_root=settings.MEDIA_ROOT)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls')),
    re_path(r'^media/(?P<path>.*)$', safe_media_serve),
    re_path(r'^images/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR, 'public', 'images')}),
    re_path(r'^static/(?P<path>.*)$', safe_static_serve),
    re_path(r'^staticfiles/(?P<path>.*)$', safe_static_serve),
]

