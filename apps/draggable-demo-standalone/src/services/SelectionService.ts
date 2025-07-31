import { VisualRectangle } from 'mr-web-components';
import type { IStyle } from 'mr-web-components';
import { VisualRectangleTokens, InteractionTokens, BehaviorAnimationTokens } from 'mr-style';

// Import mr-style canvas tokens for selection styling
// Using direct token values for now to avoid import issues
const SELECTION_TOKENS = {
  selectedBackground: '#7c3aed',    // Purple selected fill (from CanvasTokens.selectedBackground)
  selectedBorder: '#a855f7',       // Bright purple border (from CanvasTokens.selectedBorder)
  borderSelectedWidth: 3,          // Thicker border (from CanvasTokens.borderSelectedWidth)
  selectedGlow: '#8b5cf6',         // Purple glow (from CanvasTokens.selectedGlow)
  alphaHigh: 0.7                   // High opacity (from CanvasTokens.alphaHigh)
} as const;

/**
 * Service for managing object selection state and applying mr-style selection tokens
 * Follows Single Responsibility Principle - only handles selection concerns
 */
export class SelectionService {
  private selectedObjects: Set<VisualRectangle> = new Set();
  private originalStyles = new Map<VisualRectangle, IStyle>();

  constructor() {
    // No initialization needed - all properties are initialized inline
  }

  /**
   * Selects an object and applies selection styling
   */
  selectObject(obj: VisualRectangle): void {
    if (!this.selectedObjects.has(obj)) {
      this.selectedObjects.add(obj);
      obj.selected = true;
      this.applySelectionStyling(obj);
    }
  }

  /**
   * Deselects an object and removes selection styling
   */
  deselectObject(obj: VisualRectangle): void {
    if (this.selectedObjects.has(obj)) {
      this.selectedObjects.delete(obj);
      obj.selected = false;
      this.removeSelectionStyling(obj);
    }
  }

  /**
   * Toggles selection state of an object
   */
  toggleSelection(obj: VisualRectangle): void {
    if (this.isSelected(obj)) {
      this.deselectObject(obj);
    } else {
      this.selectObject(obj);
    }
  }

  /**
   * Clears all selections
   */
  clearSelection(): void {
    for (const obj of this.selectedObjects) {
      obj.selected = false;
      this.removeSelectionStyling(obj);
    }
    this.selectedObjects.clear();
  }

  /**
   * Checks if an object is selected
   */
  isSelected(obj: VisualRectangle): boolean {
    return this.selectedObjects.has(obj);
  }

  /**
   * Gets all selected objects
   */
  getSelectedObjects(): VisualRectangle[] {
    return Array.from(this.selectedObjects);
  }

  /**
   * Gets count of selected objects
   */
  getSelectionCount(): number {
    return this.selectedObjects.size;
  }

  /**
   * Applies mr-style selection tokens to an object
   */
  private applySelectionStyling(obj: VisualRectangle): void {
    // Store original styling to restore later
    if (!this.originalStyles.has(obj)) {
      this.originalStyles.set(obj, { ...obj.color });
    }

    // Apply selection styling using sophisticated mr-style component and behavior tokens
    if (obj.color) {
      obj.color = {
        ...obj.color,
        color: InteractionTokens.selected.fill,
        borderColor: InteractionTokens.selected.border,
        borderWidth: InteractionTokens.selected.borderWidth,
        glow: InteractionTokens.selected.glow,
        glowIntensity: InteractionTokens.selected.glowIntensity
      };
    }
  }

  /**
   * Removes selection styling and restores original styling
   */
  private removeSelectionStyling(obj: VisualRectangle): void {
    const originalStyle = this.originalStyles.get(obj);
    if (originalStyle) {
      obj.color = { ...originalStyle };
      this.originalStyles.delete(obj);
    }
  }

  /**
   * Updates selection styling for all selected objects (useful for theme changes)
   */
  refreshSelectionStyling(): void {
    for (const obj of this.selectedObjects) {
      this.applySelectionStyling(obj);
    }
  }

  /**
   * Applies hover styling using behavior tokens
   */
  applyHoverStyling(obj: VisualRectangle): void {
    if (!this.originalStyles.has(obj)) {
      this.originalStyles.set(obj, { ...obj.color });
    }

    if (obj.color) {
      obj.color = {
        ...obj.color,
        color: InteractionTokens.hover.fill,
        borderColor: InteractionTokens.hover.border,
        borderWidth: InteractionTokens.hover.borderWidth
      };
    }
  }

  /**
   * Applies dragging styling using behavior tokens
   */
  applyDraggingStyling(obj: VisualRectangle): void {
    if (!this.originalStyles.has(obj)) {
      this.originalStyles.set(obj, { ...obj.color });
    }

    if (obj.color) {
      obj.color = {
        ...obj.color,
        color: InteractionTokens.dragging.fill,
        borderColor: InteractionTokens.dragging.border,
        borderWidth: InteractionTokens.dragging.borderWidth
      };
    }
  }

  /**
   * Gets component-specific styling tokens for VisualRectangle
   */
  getComponentTokens() {
    return {
      rectangle: VisualRectangleTokens,
      interaction: InteractionTokens,
      animation: BehaviorAnimationTokens
    };
  }

  /**
   * Handles click selection with optional multi-select support
   */
  handleClick(obj: VisualRectangle, multiSelect: boolean = false): void {
    if (!multiSelect) {
      // Single select mode - clear other selections first
      const wasSelected = this.isSelected(obj);
      this.clearSelection();
      
      if (!wasSelected) {
        this.selectObject(obj);
      }
    } else {
      // Multi-select mode - toggle this object
      this.toggleSelection(obj);
    }
  }
}
