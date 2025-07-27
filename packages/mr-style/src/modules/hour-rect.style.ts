import { css, unsafeCSS } from 'lit';
import { ColorTokens as C } from '../tokens/color.tokens';
import { SizeTokens as S } from '../tokens/size.tokens';
import { SpacingTokens as SP } from '../tokens/spacing.tokens';
import { FlexTokens as F } from '../tokens/flex.tokens';

export const hourRectStyles = css`
  :host {
    display: inline-block;
    width: ${unsafeCSS(S.hourWidth)};
    margin: 0 ${unsafeCSS(SP.hourMarginX)};
    vertical-align: bottom;
  }
  .bar {
    width: 100%;
    display: block;
    position: relative;
    transition: height 0.3s ease, background-color 0.3s ease;
  }
  .tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${unsafeCSS(C.tooltipBg)};
    color: ${unsafeCSS(C.tooltipText)};
    font-size: 0.75rem;
    padding: ${unsafeCSS(SP.tooltipPadding)};
    border-radius: ${unsafeCSS(SP.tooltipRadius)};
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }
  :host(:hover) .tooltip {
    opacity: 1;
  }
  .flex-center {
    display: ${unsafeCSS(F.displayFlex)};
    justify-content: ${unsafeCSS(F.justifyCenter)};
    align-items: ${unsafeCSS(F.alignCenter)};
  }
`;
