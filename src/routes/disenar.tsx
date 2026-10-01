import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Type,
  Heading1,
  Heading2,
  AlignLeft,
  Palette,
  X,
  Sliders,
  Check,
  Link2,
  ExternalLink,
  Edit3,
  LayoutTemplate,
  Sparkles,
  ChevronRight,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { TEMPLATES_LIST, type TemplateData } from "@/data/templates";

export const Route = createFileRoute("/disenar")({
  head: () => ({
    meta: [
      { title: "Diseñar mi página — Chatly" },
      {
        name: "description",
        content: "Diseña y personaliza tu propia página de enlaces y grupos en Chatly.",
      },
      { property: "og:title", content: "Diseñar mi página — Chatly" },
      {
        property: "og:description",
        content: "Diseña y personaliza tu propia página de enlaces y grupos en Chatly.",
      },
    ],
  }),
  component: DisenarPagina,
});

type TextType = "title" | "subtitle" | "text";

interface TextElement {
  id: string;
  kind: "text";
  type: TextType;
  text: string;
  fontSize: number; // 1 a 50
  color: string;
}

interface LinkElement {
  id: string;
  kind: "link";
  url: string;
  title: string;
  colorStyle: "green" | "blue";
}

type PageItem = TextElement | LinkElement;

const PRESET_COLORS = [
  "#000000",
  "#FFFFFF",
  "#10B981", // Emerald
  "#059669", // Dark emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F59E0B", // Amber / Yellow
  "#6B7280", // Gray
];

function DisenarPagina() {
  const router = useRouter();
  const t = useT();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Modo de interacción: edición vs vista previa
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Fondo (imagen personalizada o gradiente/color de plantilla)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [customBackgroundStyle, setCustomBackgroundStyle] = useState<{
    gradient?: string;
    bgColor?: string;
  } | null>(null);

  // Lista unificada y ordenada de elementos para garantizar que NUNCA se superpongan
  const [items, setItems] = useState<PageItem[]>([]);

  // Selección activa
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Menús y diálogos
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Modal para crear / editar enlace
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkModalMode, setLinkModalMode] = useState<"create" | "edit">("create");
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [inputColorStyle, setInputColorStyle] = useState<"green" | "blue">("green");
  const [linkError, setLinkError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setBackgroundImage(imageUrl);
    setCustomBackgroundStyle(null);

    // Ajustar textos oscuros a blanco para máxima legibilidad sobre el fondo
    setItems((prev) =>
      prev.map((it) => {
        if (it.kind === "text" && it.color === "#000000") {
          return { ...it, color: "#FFFFFF" };
        }
        return it;
      }),
    );
  };

  const handleOpenPicker = () => {
    fileInputRef.current?.click();
    setShowTextMenu(false);
    setShowTemplatesModal(false);
  };

  const handleRemoveBackground = () => {
    setBackgroundImage(null);
    setCustomBackgroundStyle(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTextElement = (type: TextType) => {
    const id = "txt_" + Math.random().toString(36).slice(2, 9);
    const hasDarkBackground = backgroundImage || Boolean(customBackgroundStyle?.gradient);
    const defaultColor = hasDarkBackground ? "#FFFFFF" : "#000000";

    let defaultText = "Escribe aquí tu texto...";
    let defaultFontSize = 16;

    if (type === "title") {
      defaultText = "Título principal";
      defaultFontSize = 28;
    } else if (type === "subtitle") {
      defaultText = "Subtítulo de la página";
      defaultFontSize = 18;
    } else {
      defaultText = "Escribe una descripción o información aquí...";
      defaultFontSize = 14;
    }

    const newElement: TextElement = {
      id,
      kind: "text",
      type,
      text: defaultText,
      fontSize: defaultFontSize,
      color: defaultColor,
    };

    setItems((prev) => [...prev, newElement]);
    setSelectedId(id);
    setShowTextMenu(false);
  };

  // Abrir modal de enlace nuevo
  const openNewLinkModal = () => {
    setLinkModalMode("create");
    setEditingLinkId(null);
    setInputUrl("");
    setInputTitle("");
    setInputColorStyle("green");
    setLinkError(null);
    setShowLinkModal(true);
    setShowTextMenu(false);
    setShowTemplatesModal(false);
  };

  // Abrir modal de editar enlace existente
  const openEditLinkModal = (link: LinkElement) => {
    setLinkModalMode("edit");
    setEditingLinkId(link.id);
    setInputUrl(link.url);
    setInputTitle(link.title);
    setInputColorStyle(link.colorStyle);
    setLinkError(null);
    setShowLinkModal(true);
  };

  // Guardar enlace desde modal
  const handleSaveLink = (e: FormEvent) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim();
    const cleanTitle = inputTitle.trim();

    if (!cleanTitle) {
      setLinkError("Por favor escribe el nombre visible.");
      return;
    }
    if (!cleanUrl) {
      setLinkError("Por favor ingresa la URL o enlace.");
      return;
    }

    let finalUrl = cleanUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    if (linkModalMode === "create") {
      const id = "lnk_" + Math.random().toString(36).slice(2, 9);
      const newLink: LinkElement = {
        id,
        kind: "link",
        url: finalUrl,
        title: cleanTitle,
        colorStyle: inputColorStyle,
      };

      setItems((prev) => [...prev, newLink]);
      setSelectedId(id);
    } else if (editingLinkId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingLinkId && it.kind === "link"
            ? { ...it, url: finalUrl, title: cleanTitle, colorStyle: inputColorStyle }
            : it,
        ),
      );
    }

    setShowLinkModal(false);
  };

  // Cargar una de las plantillas
  const handleSelectTemplate = (template: TemplateData) => {
    if (template.backgroundImageUrl) {
      setBackgroundImage(template.backgroundImageUrl);
      setCustomBackgroundStyle(null);
    } else if (template.backgroundStyle) {
      setCustomBackgroundStyle(template.backgroundStyle);
      setBackgroundImage(null);
    } else {
      setCustomBackgroundStyle(null);
      setBackgroundImage(null);
    }

    const loadedItems: PageItem[] = [
      ...template.texts.map((t, idx) => ({
        id: "txt_tpl_" + idx + "_" + Math.random().toString(36).slice(2, 7),
        kind: "text" as const,
        type: t.type,
        text: t.text,
        fontSize: t.fontSize,
        color: t.color,
      })),
      ...template.links.map((l, idx) => ({
        id: "lnk_tpl_" + idx + "_" + Math.random().toString(36).slice(2, 7),
        kind: "link" as const,
        url: l.url,
        title: l.title,
        colorStyle: l.colorStyle,
      })),
    ];

    setItems(loadedItems);
    setSelectedId(null);
    setShowTemplatesModal(false);
  };

  const selectedItem = items.find((it) => it.id === selectedId);

  const updateSelectedText = (updates: Partial<TextElement>) => {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((it) => (it.id === selectedId && it.kind === "text" ? { ...it, ...updates } : it)),
    );
  };

  const removeSelectedItem = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((it) => it.id !== selectedId));
    setSelectedId(null);
  };

  // Mover elemento arriba o abajo en el orden de la página
  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    setItems((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedId(null);
      setShowColorPicker(false);
      setShowSizeSlider(false);
      setShowTextMenu(false);
    }
  };

  const canvasBackgroundStyle: React.CSSProperties = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }
    : customBackgroundStyle?.gradient
      ? {
          backgroundImage: customBackgroundStyle.gradient,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }
      : customBackgroundStyle?.bgColor
        ? {
            backgroundColor: customBackgroundStyle.bgColor,
          }
        : {};

  return (
    <div
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="relative min-h-screen select-none bg-background font-sans text-foreground transition-all duration-300 overflow-x-hidden overflow-y-auto"
      style={canvasBackgroundStyle}
    >
      {/* Capa de contraste sutil si hay imagen de fondo */}
      {backgroundImage && (
        <div className="pointer-events-none fixed inset-0 bg-black/25 backdrop-blur-[0.5px]" />
      )}

      {/* Input de archivo oculto para abrir la galería */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="Subir imagen de fondo"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Barra superior con todos los iconos circulares limpios y uniformes */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-3.5 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 1. Flechita para salir */}
          <button
            type="button"
            onClick={() => router.history.back()}
            aria-label={t("back")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-foreground transition-colors hover:bg-muted/50 cursor-pointer shadow-sm backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* 2. Botón para subir imagen de fondo */}
          <button
            type="button"
            onClick={handleOpenPicker}
            aria-label="Subir imagen de fondo"
            title="Elegir imagen de fondo"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-foreground transition-colors hover:bg-muted/50 cursor-pointer shadow-sm backdrop-blur-sm"
          >
            <Upload className="h-4 w-4" />
          </button>

          {/* 3. Botón de Texto: abre opciones Título, Subtítulo, Texto */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTextMenu((prev) => !prev);
                setShowColorPicker(false);
                setShowSizeSlider(false);
                setShowTemplatesModal(false);
              }}
              aria-label="Agregar texto"
              title="Agregar texto (Título, Subtítulo o Texto)"
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer shadow-sm backdrop-blur-sm ${
                showTextMenu
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border/80 bg-surface/90 text-foreground hover:bg-muted/50"
              }`}
            >
              <Type className="h-4 w-4" />
            </button>

            {/* Menú limpio de opciones de texto */}
            {showTextMenu && (
              <div className="animate-in fade-in zoom-in-95 duration-150 absolute top-10 left-0 z-30 w-44 rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-float)] backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => addTextElement("title")}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-foreground transition-colors hover:bg-muted/60 cursor-pointer"
                >
                  <Heading1 className="h-4 w-4 text-brand" />
                  <span>Título</span>
                </button>
                <button
                  type="button"
                  onClick={() => addTextElement("subtitle")}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-foreground transition-colors hover:bg-muted/60 cursor-pointer"
                >
                  <Heading2 className="h-4 w-4 text-brand" />
                  <span>Subtítulo</span>
                </button>
                <button
                  type="button"
                  onClick={() => addTextElement("text")}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted/60 cursor-pointer"
                >
                  <AlignLeft className="h-4 w-4 text-brand" />
                  <span>Texto</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Botón de Enlace Encubierto en línea */}
          <button
            type="button"
            onClick={openNewLinkModal}
            aria-label="Agregar enlace"
            title="Agregar enlace en línea"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-foreground transition-colors hover:bg-muted/50 cursor-pointer shadow-sm backdrop-blur-sm"
          >
            <Link2 className="h-4 w-4" />
          </button>

          {/* 5. Botón de Plantillas */}
          <button
            type="button"
            onClick={() => {
              setShowTemplatesModal(true);
              setShowTextMenu(false);
            }}
            aria-label="Elegir plantilla"
            title={`Elegir entre ${TEMPLATES_LIST.length} plantillas limpias`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-foreground transition-colors hover:bg-muted/50 cursor-pointer shadow-sm backdrop-blur-sm"
          >
            <LayoutTemplate className="h-4 w-4" />
          </button>

          {/* Botón para eliminar fondo si hay uno activo */}
          {(backgroundImage || customBackgroundStyle) && (
            <button
              type="button"
              onClick={handleRemoveBackground}
              aria-label="Quitar fondo"
              title="Quitar fondo"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-destructive transition-colors hover:bg-destructive/10 cursor-pointer shadow-sm backdrop-blur-sm"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 6. Botón de icono circular para alternar Vista Previa / Edición (mismo tamaño h-8 w-8) */}
        <button
          type="button"
          onClick={() => {
            setIsPreviewMode((prev) => !prev);
            setSelectedId(null);
          }}
          aria-label={isPreviewMode ? "Volver a editar" : "Ver vista previa"}
          title={isPreviewMode ? "Volver a modo edición" : "Vista previa (probar enlaces)"}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer shadow-sm backdrop-blur-sm ${
            isPreviewMode
              ? "border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/20"
              : "border-border/80 bg-surface/90 text-foreground hover:bg-muted/50"
          }`}
        >
          {isPreviewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </header>

      {/* Contenedor central ordenado con flujo vertical natural: NUNCA se superpone el texto */}
      <main className="relative z-10 mx-auto max-w-xl px-4 py-4 sm:py-6 pb-36 flex flex-col space-y-4 sm:space-y-5">
        {items.length === 0 && (
          <div className="py-20 text-center text-muted-foreground/60">
            <p className="text-sm font-medium">Lienzo en blanco</p>
            <p className="text-xs mt-1">
              Toca el icono de texto (<span className="font-bold">T</span>), enlace (
              <span className="font-bold">🔗</span>) o elige una plantilla de la barra superior.
            </p>
          </div>
        )}

        {items.map((item, index) => {
          const isSelected = item.id === selectedId && !isPreviewMode;

          if (item.kind === "text") {
            return (
              <OrderedTextItem
                key={item.id}
                element={item}
                index={index}
                total={items.length}
                isSelected={isSelected}
                hasBackground={Boolean(backgroundImage || customBackgroundStyle?.gradient)}
                onSelect={() => {
                  if (!isPreviewMode) setSelectedId(item.id);
                }}
                onMove={(dir) => moveItem(index, dir)}
                onUpdateText={(text) => updateSelectedText({ text })}
              />
            );
          }

          return (
            <OrderedLinkItem
              key={item.id}
              link={item}
              index={index}
              total={items.length}
              isSelected={isSelected}
              isPreviewMode={isPreviewMode}
              onSelect={() => {
                if (!isPreviewMode) setSelectedId(item.id);
              }}
              onMove={(dir) => moveItem(index, dir)}
              onEditLink={() => openEditLinkModal(item)}
            />
          );
        })}
      </main>

      {/* Barra flotante inferior de edición para TEXTO */}
      {selectedItem && selectedItem.kind === "text" && !isPreviewMode && (
        <div className="animate-in slide-in-from-bottom-5 duration-200 fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full border border-border bg-surface/95 px-3.5 py-2 shadow-[var(--shadow-float)] backdrop-blur-md">
          {/* Bolita numérica de tamaño (1 a 50) */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => {
                setShowSizeSlider((prev) => !prev);
                setShowColorPicker(false);
              }}
              title="Ajustar tamaño de letra (1-50)"
              className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-bold text-foreground transition-colors hover:bg-muted cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-brand" />
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[0.65rem] font-bold text-brand-foreground shadow-sm">
                {selectedItem.fontSize}
              </span>
            </button>

            {/* Slider emergente de tamaño */}
            {showSizeSlider && (
              <div className="animate-in fade-in zoom-in-95 absolute bottom-12 left-0 w-48 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-float)]">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Tamaño</span>
                  <span className="text-brand">{selectedItem.fontSize} px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={selectedItem.fontSize}
                  onChange={(e) => updateSelectedText({ fontSize: parseInt(e.target.value, 10) })}
                  className="mt-2.5 w-full accent-brand cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Selector de color */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker((prev) => !prev);
                setShowSizeSlider(false);
              }}
              title="Cambiar color del texto"
              className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer"
            >
              <Palette className="h-3.5 w-3.5 text-brand" />
              <span
                className="h-4 w-4 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: selectedItem.color }}
              />
            </button>

            {/* Paleta de colores emergente */}
            {showColorPicker && (
              <div className="animate-in fade-in zoom-in-95 absolute bottom-12 left-0 flex w-56 flex-wrap gap-2 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-float)]">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      updateSelectedText({ color: c });
                      setShowColorPicker(false);
                    }}
                    style={{ backgroundColor: c }}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-border/80 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                  >
                    {selectedItem.color === c && (
                      <Check
                        className={`h-3 w-3 ${c === "#FFFFFF" || c === "#F59E0B" ? "text-black" : "text-white"}`}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                ))}
                <label className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-dashed border-border bg-muted text-[0.6rem] font-bold">
                  +
                  <input
                    type="color"
                    value={selectedItem.color}
                    onChange={(e) => updateSelectedText({ color: e.target.value })}
                    className="sr-only"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Botón para eliminar este texto */}
          <button
            type="button"
            onClick={removeSelectedItem}
            title="Eliminar texto"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          {/* Cerrar barra de edición */}
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            title="Desmarcar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Barra flotante inferior de edición para ENLACE */}
      {selectedItem && selectedItem.kind === "link" && !isPreviewMode && (
        <div className="animate-in slide-in-from-bottom-5 duration-200 fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full border border-border bg-surface/95 px-3.5 py-2 shadow-[var(--shadow-float)] backdrop-blur-md">
          {/* Botón para editar texto y URL */}
          <button
            type="button"
            onClick={() => openEditLinkModal(selectedItem)}
            title="Editar nombre y URL"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-brand" />
            <span>Editar datos</span>
          </button>

          {/* Botón para probar/abrir enlace */}
          <button
            type="button"
            onClick={() => window.open(selectedItem.url, "_blank", "noopener,noreferrer")}
            title="Probar apertura de enlace"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 text-brand" />
            <span>Probar</span>
          </button>

          {/* Alternar entre verde o azul */}
          <button
            type="button"
            onClick={() =>
              setItems((prev) =>
                prev.map((it) =>
                  it.id === selectedItem.id && it.kind === "link"
                    ? {
                        ...it,
                        colorStyle: it.colorStyle === "green" ? "blue" : "green",
                      }
                    : it,
                ),
              )
            }
            title="Alternar estilo Verde / Azul"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-muted cursor-pointer"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                selectedItem.colorStyle === "green" ? "bg-emerald-500" : "bg-blue-500"
              }`}
            />
            <span className="text-[0.7rem] capitalize">
              {selectedItem.colorStyle === "green" ? "Verde" : "Azul"}
            </span>
          </button>

          {/* Botón para eliminar este enlace */}
          <button
            type="button"
            onClick={removeSelectedItem}
            title="Eliminar enlace"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          {/* Cerrar barra de edición */}
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            title="Desmarcar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Modal para crear / editar enlace */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[2rem] border border-border bg-surface p-6 shadow-[var(--shadow-float)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Link2 className="h-4 w-4" />
                </span>
                <h2 className="font-display text-base font-bold text-foreground">
                  {linkModalMode === "create" ? "Poner enlace" : "Editar nombre y enlace"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="mt-5 space-y-4">
              {/* Recuadro 1: Lo que quiere que diga sobre el enlace */}
              <div>
                <label className="block font-display text-xs font-bold text-foreground">
                  1. Nombre o texto visible
                </label>
                <div className="mt-1.5 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-sm focus-within:border-brand">
                  <input
                    type="text"
                    placeholder="Ej: Únete a mi grupo de WhatsApp"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
              </div>

              {/* Recuadro 2: El enlace / URL */}
              <div>
                <label className="block font-display text-xs font-bold text-foreground">
                  2. Enlace o URL de destino
                </label>
                <div className="mt-1.5 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-sm focus-within:border-brand">
                  <input
                    type="text"
                    inputMode="url"
                    placeholder="Ej: https://chat.whatsapp.com/..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Selector de color: Verde o Azul */}
              <div>
                <label className="block font-display text-xs font-bold text-foreground mb-1.5">
                  3. Color del enlace
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInputColorStyle("green")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-colors cursor-pointer ${
                      inputColorStyle === "green"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-border text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Verde</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputColorStyle("blue")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-colors cursor-pointer ${
                      inputColorStyle === "blue"
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                        : "border-border text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span>Azul</span>
                  </button>
                </div>
              </div>

              {linkError && <p className="text-xs font-semibold text-destructive">{linkError}</p>}

              <div className="mt-6 flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 rounded-full border border-border py-2.5 font-display text-xs font-bold text-foreground transition-colors hover:bg-muted cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full brand-gradient py-2.5 font-display text-xs font-bold text-brand-foreground shadow-sm transition-opacity hover:opacity-95 cursor-pointer"
                >
                  {linkModalMode === "create" ? "Agregar enlace" : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Drawer limpio de las 30 Plantillas: lista fina una bajo la otra */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-border bg-surface shadow-[var(--shadow-float)] overflow-hidden">
            {/* Cabecera ultra limpia */}
            <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <h2 className="font-display text-sm font-bold text-foreground">
                  {TEMPLATES_LIST.length} Plantillas editables
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Lista minimalista de las 30 plantillas: una bajo la otra con nombres finos */}
            <div className="overflow-y-auto px-6 py-3 divide-y divide-border/40 max-h-[68vh]">
              {TEMPLATES_LIST.map((tpl, index) => {
                const isGreenTheme = tpl.colorTheme === "green";

                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className="group flex w-full items-center justify-between py-3.5 text-left transition-all hover:pl-1.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-semibold text-muted-foreground/60 w-5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`truncate text-sm font-bold transition-colors ${
                          isGreenTheme
                            ? "text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500"
                            : "text-blue-600 dark:text-blue-400 group-hover:text-blue-500"
                        }`}
                      >
                        {tpl.name}
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Componente de elemento de texto multilínea auto-ajustable con botones de reordenamiento */
function OrderedTextItem({
  element,
  index,
  total,
  isSelected,
  hasBackground,
  onSelect,
  onMove,
  onUpdateText,
}: {
  element: TextElement;
  index: number;
  total: number;
  isSelected: boolean;
  hasBackground: boolean;
  onSelect: () => void;
  onMove: (dir: "up" | "down") => void;
  onUpdateText: (text: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        element.fontSize * 1.25,
      )}px`;
    }
  }, [element.text, element.fontSize]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.max(e.target.scrollHeight, element.fontSize * 1.25)}px`;
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`w-full transition-all ${
        isSelected
          ? "rounded-2xl ring-2 ring-brand ring-offset-2 ring-offset-background/40 bg-surface/40 backdrop-blur-[2px] p-2.5 shadow-sm"
          : "p-1 hover:ring-1 hover:ring-border/40 rounded-xl"
      }`}
    >
      {/* Controles de orden cuando está seleccionado */}
      {isSelected && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                onMove("up");
              }}
              title="Subir posición"
              className="flex h-5 w-5 items-center justify-center rounded-md bg-surface/80 text-foreground transition-colors hover:bg-muted disabled:opacity-30 cursor-pointer"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              disabled={index === total - 1}
              onClick={(e) => {
                e.stopPropagation();
                onMove("down");
              }}
              title="Bajar posición"
              className="flex h-5 w-5 items-center justify-center rounded-md bg-surface/80 text-foreground transition-colors hover:bg-muted disabled:opacity-30 cursor-pointer"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
            <span className="text-[0.68rem] font-medium ml-1">Mover posición</span>
          </div>
          <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground font-bold">
            {element.type === "title"
              ? "Título"
              : element.type === "subtitle"
                ? "Subtítulo"
                : "Texto"}
          </span>
        </div>
      )}

      {/* Área de texto que se expande sin superponerse jamás */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={element.text}
        onChange={handleInput}
        onFocus={onSelect}
        placeholder="Escribe aquí..."
        style={{
          fontSize: `${element.fontSize}px`,
          color: element.color,
          lineHeight: 1.25,
          fontWeight:
            element.type === "title" ? "700" : element.type === "subtitle" ? "600" : "400",
          textShadow:
            hasBackground && element.color === "#FFFFFF" ? "0 1px 4px rgba(0,0,0,0.6)" : undefined,
        }}
        className="w-full resize-none overflow-hidden bg-transparent outline-none border-none p-0 m-0 break-words whitespace-pre-wrap leading-tight placeholder:text-muted-foreground/60"
        aria-label="Escribir texto"
      />
    </div>
  );
}

/** Componente de enlace en una sola línea ordenada: al tocarlo en edición edita; en vista previa abre URL */
function OrderedLinkItem({
  link,
  index,
  total,
  isSelected,
  isPreviewMode,
  onSelect,
  onMove,
  onEditLink,
}: {
  link: LinkElement;
  index: number;
  total: number;
  isSelected: boolean;
  isPreviewMode: boolean;
  onSelect: () => void;
  onMove: (dir: "up" | "down") => void;
  onEditLink: () => void;
}) {
  const isGreen = link.colorStyle === "green";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPreviewMode) {
      window.open(link.url, "_blank", "noopener,noreferrer");
    } else {
      onSelect();
      onEditLink();
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`w-full transition-all ${
        isSelected && !isPreviewMode
          ? "rounded-xl ring-2 ring-brand ring-offset-2 ring-offset-background/40 bg-surface/60 backdrop-blur-sm p-2 shadow-sm"
          : "p-1 hover:opacity-90"
      }`}
    >
      {/* Controles de orden cuando está seleccionado */}
      {isSelected && !isPreviewMode && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                onMove("up");
              }}
              title="Subir posición"
              className="flex h-5 w-5 items-center justify-center rounded-md bg-surface/80 text-foreground transition-colors hover:bg-muted disabled:opacity-30 cursor-pointer"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              disabled={index === total - 1}
              onClick={(e) => {
                e.stopPropagation();
                onMove("down");
              }}
              title="Bajar posición"
              className="flex h-5 w-5 items-center justify-center rounded-md bg-surface/80 text-foreground transition-colors hover:bg-muted disabled:opacity-30 cursor-pointer"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
            <span className="text-[0.65rem] font-medium ml-1">Mover posición</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditLink();
            }}
            className="flex items-center gap-1 text-[0.65rem] font-bold underline cursor-pointer"
          >
            <Edit3 className="h-2.5 w-2.5" />
            <span>Editar datos</span>
          </button>
        </div>
      )}

      {/* Enlace en una línea fina y elegante */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
        title={isPreviewMode ? `Abrir: ${link.url}` : "Toca para cambiar nombre y enlace"}
        className={`group inline-flex items-center gap-1.5 text-sm sm:text-base font-bold underline decoration-2 underline-offset-4 cursor-pointer transition-all hover:opacity-80 active:scale-[0.98] ${
          isGreen
            ? "text-emerald-600 dark:text-emerald-400 decoration-emerald-500/60"
            : "text-blue-600 dark:text-blue-400 decoration-blue-500/60"
        }`}
      >
        <span className="break-words">{link.title}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
