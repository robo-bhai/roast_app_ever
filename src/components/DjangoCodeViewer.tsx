import React, { useState } from 'react';
import { DJANGO_FILES } from '../data/djangoCodebase';
import { DjangoFile } from '../types/app';
import { 
  Copy, Check, Download, FileCode, FolderArchive, 
  Terminal, ExternalLink, ChevronRight, FileText, CheckCircle2 
} from 'lucide-react';
import JSZip from 'jszip';

export const DjangoCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DjangoFile>(DJANGO_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (isZipping) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();

      // Project structure
      DJANGO_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add a standard manage.py
      zip.file(
        'manage.py',
        `#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'appstore_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
`
      );

      // Add wsgi.py and asgi.py
      zip.file(
        'appstore_project/wsgi.py',
        `import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'appstore_project.settings')
application = get_wsgi_application()
`
      );

      zip.file(
        'appstore_project/urls.py',
        `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls')),
]
`
      );

      zip.file('store/__init__.py', '');
      zip.file(
        'store/apps.py',
        `from django.apps import AppConfig
class StoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'store'
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'appstore_django_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <FolderArchive className="w-4 h-4" />
            <span>Python / Django Production Deliverables</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Complete Django AppStore Architecture
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
            Inspect the complete, modular code files for <code className="text-amber-300">models.py</code>, <code className="text-amber-300">views.py</code> (18 items pagination + live AJAX search), <code className="text-amber-300">forms.py</code>, and Tailwind dark templates.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className={`px-6 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xl transition-all shrink-0 ${
            zipSuccess
              ? 'bg-emerald-500 text-black shadow-emerald-500/30'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/25 hover:scale-102'
          }`}
        >
          {zipSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Project Zip Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Packaging ZIP...' : 'Download Full Django Project (.zip)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Setup Terminal Cheatsheet */}
      <div className="glass-panel rounded-2xl p-5 border border-amber-500/15">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
          <Terminal className="w-4 h-4" />
          <span>Quickstart Execution Commands</span>
        </div>
        <div className="bg-[#120e0b] rounded-xl p-4 font-mono text-xs text-stone-300 overflow-x-auto space-y-1 border border-amber-500/10">
          <div><span className="text-stone-500"># 1. Setup virtualenv and install packages</span></div>
          <div><span className="text-amber-400">$</span> python -m venv venv && source venv/bin/activate</div>
          <div><span className="text-amber-400">$</span> pip install -r requirements.txt</div>
          <div className="pt-2"><span className="text-stone-500"># 2. Run migrations & create admin</span></div>
          <div><span className="text-amber-400">$</span> python manage.py makemigrations && python manage.py migrate</div>
          <div><span className="text-amber-400">$</span> python manage.py createsuperuser</div>
          <div className="pt-2"><span className="text-stone-500"># 3. Start local development server on port 8000</span></div>
          <div><span className="text-amber-400">$</span> python manage.py runserver</div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: File Tree Directory */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 border border-amber-500/15 space-y-2">
          <div className="px-2 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider">
            Project Files ({DJANGO_FILES.length})
          </div>

          <div className="space-y-1">
            {DJANGO_FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                      : 'hover:bg-amber-500/10 text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                    <div className="truncate">
                      <div className="font-mono text-white text-xs">{file.name}</div>
                      <div className="text-[10px] text-stone-400 truncate">{file.path}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-stone-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl">
          
          {/* Header of code block */}
          <div className="bg-[#120e0b] px-6 py-4 border-b border-amber-500/15 flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-mono text-xs font-bold text-amber-300 flex items-center gap-2">
                <span>{selectedFile.path}</span>
                <span className="text-[10px] text-stone-500 uppercase px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800">
                  {selectedFile.language}
                </span>
              </div>
              <div className="text-xs text-stone-400 truncate mt-0.5">
                {selectedFile.description}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold text-stone-300 hover:text-amber-400 hover:border-amber-400 flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax block with scroll */}
          <div className="p-4 sm:p-6 bg-[#0a0705] overflow-x-auto max-h-[650px] font-mono text-xs leading-relaxed text-stone-200">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
