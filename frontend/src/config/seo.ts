import { useEffect } from 'react';

interface SEOConfig {
  seo_titulo?: string;
  seo_descripcion?: string;
  seo_keywords?: string;
  [key: string]: string | undefined;
}

export const useSEO = () => {
  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        const response = await fetch('/api/configuracion');
        const data: SEOConfig = await response.json();
        
        // document existe en el navegador
        if (typeof document !== 'undefined') {
          if (data.seo_titulo) {
            document.title = data.seo_titulo;
          }
          
          if (data.seo_descripcion) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.setAttribute('content', data.seo_descripcion);
            }
            
            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) {
              ogDescription.setAttribute('content', data.seo_descripcion);
            }
            
            const twitterDescription = document.querySelector('meta[name="twitter:description"]');
            if (twitterDescription) {
              twitterDescription.setAttribute('content', data.seo_descripcion);
            }
          }
          
          if (data.seo_keywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
              metaKeywords.setAttribute('content', data.seo_keywords);
            }
          }
          
          if (data.seo_titulo) {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
              ogTitle.setAttribute('content', data.seo_titulo);
            }
            
            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle) {
              twitterTitle.setAttribute('content', data.seo_titulo);
            }
          }
        }
      } catch (error) {
        console.error('Error cargando SEO:', error);
      }
    };
    
    fetchSEOData();
  }, []);
};