export interface Translations {
  header: {
    title: string
    subtitle: string
  }
  input: {
    title: string
    placeholder: string
    help: string
  }
  preview: {
    title: string
    downloadAll: string
    downloading: string
    slideImage: string
    downloadSlide: string
  }
  settings: {
    title: string
    backgroundImages: string
    textColor: string
    currentBackgrounds: string
    themeManagement: string
    currentTheme: string
    createNewTheme: string
  }
  themeEditor: {
    title: string
    themeName: string
    themeNamePlaceholder: string
    textColor: string
    backgroundImages: string
    backgroundImagesHelp: string
    firstSlideBackground: string
    middleSlidesBackground: string
    lastSlideBackground: string
    uploading: string
    firstBackgroundUploaded: string
    middleBackgroundUploaded: string
    lastBackgroundUploaded: string
    cancel: string
    createTheme: string
    creating: string
    addTheme: string
  }
  themeSelector: {
    title: string
    noThemesCreated: string
    noThemesCreatedHelp: string
    clickToSelect: string
    customThemesCanBeDeleted: string
  }
  instructions: {
    title: string
    subtitle: string
  }
  common: {
    slides: string
    loading: string
  }
}

export const translations: Record<'es' | 'en', Translations> = {
  es: {
    header: {
      title: "Los Coaches - Slide Builder",
      subtitle: "Crea presentaciones profesionales desde contenido Markdown"
    },
    input: {
      title: "Entrada Markdown",
      placeholder: "Pega tu contenido aquí...",
      help: 'Usa "---" para separar slides. Cada slide debe empezar con "## Título" seguido del contenido. Usa "- " para viñetas y "> " para citas.'
    },
    preview: {
      title: "Slides Generados",
      downloadAll: "Descargar Todo",
      downloading: "Descargando...",
      slideImage: "Imagen del Slide",
      downloadSlide: "Descargar Slide"
    },
    settings: {
      title: "Configuración de Slides",
      backgroundImages: "Imágenes de Fondo",
      textColor: "Color del Texto",
      currentBackgrounds: "Fondos Actuales",
      themeManagement: "Gestión de Temas",
      currentTheme: "Tema Actual",
      createNewTheme: "Crear Nuevo Tema"
    },
    themeEditor: {
      title: "Crear Nuevo Tema",
      themeName: "Nombre del Tema",
      themeNamePlaceholder: "Ingresa nombre del tema...",
      textColor: "Color del Texto",
      backgroundImages: "Imágenes de Fondo",
      backgroundImagesHelp: "Sube tres imágenes de fondo para tu tema. Los temas se guardan permanentemente.",
      firstSlideBackground: "Fondo del Primer Slide",
      middleSlidesBackground: "Fondo de Slides Intermedios",
      lastSlideBackground: "Fondo del Último Slide",
      uploading: "Subiendo...",
      firstBackgroundUploaded: "✓ Primer fondo subido",
      middleBackgroundUploaded: "✓ Fondo intermedio subido",
      lastBackgroundUploaded: "✓ Último fondo subido",
      cancel: "Cancelar",
      createTheme: "Crear Tema",
      creating: "Creando...",
      addTheme: "Agregar Tema"
    },
    themeSelector: {
      title: "Seleccionar Tema",
      noThemesCreated: "Aún no se han creado temas",
      noThemesCreatedHelp: "Crea tu primer tema para comenzar",
      clickToSelect: "* Haz clic en un tema para seleccionarlo. Los temas se guardan permanentemente y se pueden eliminar.",
      customThemesCanBeDeleted: "Los temas personalizados se pueden eliminar."
    },
    instructions: {
      title: "Cómo usar el Slide Builder",
      subtitle: "Guía paso a paso para crear presentaciones profesionales"
    },
    common: {
      slides: "slides",
      loading: "Cargando..."
    }
  },
  en: {
    header: {
      title: "Los Coaches - Slide Builder",
      subtitle: "Create professional presentations from Markdown content"
    },
    input: {
      title: "Markdown Input",
      placeholder: "Paste your content here...",
      help: 'Use "---" to separate slides. Each slide should start with "## Title" followed by content. Use "- " for bullets and "> " for quotes.'
    },
    preview: {
      title: "Generated Slides",
      downloadAll: "Download All",
      downloading: "Downloading...",
      slideImage: "Slide Image",
      downloadSlide: "Download Slide"
    },
    settings: {
      title: "Slide Settings",
      backgroundImages: "Background Images",
      textColor: "Text Color",
      currentBackgrounds: "Current Backgrounds",
      themeManagement: "Theme Management",
      currentTheme: "Current Theme",
      createNewTheme: "Create New Theme"
    },
    themeEditor: {
      title: "Create New Theme",
      themeName: "Theme Name",
      themeNamePlaceholder: "Enter theme name...",
      textColor: "Text Color",
      backgroundImages: "Background Images",
      backgroundImagesHelp: "Upload three background images for your theme. Themes are permanently saved.",
      firstSlideBackground: "First Slide Background",
      middleSlidesBackground: "Middle Slides Background",
      lastSlideBackground: "Last Slide Background",
      uploading: "Uploading...",
      firstBackgroundUploaded: "✓ First background uploaded",
      middleBackgroundUploaded: "✓ Middle background uploaded",
      lastBackgroundUploaded: "✓ Last background uploaded",
      cancel: "Cancel",
      createTheme: "Create Theme",
      creating: "Creating...",
      addTheme: "Add Theme"
    },
    themeSelector: {
      title: "Select Theme",
      noThemesCreated: "No themes created yet",
      noThemesCreatedHelp: "Create your first theme to get started",
      clickToSelect: "* Click on a theme to select it. Themes are permanently saved and can be deleted.",
      customThemesCanBeDeleted: "Custom themes can be deleted."
    },
    instructions: {
      title: "How to use the Slide Builder",
      subtitle: "Step-by-step guide to create professional presentations"
    },
    common: {
      slides: "slides",
      loading: "Loading..."
    }
  }
}

export function getTranslation(language: 'es' | 'en'): Translations {
  return translations[language]
} 