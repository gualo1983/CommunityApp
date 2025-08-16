module.exports = {
  // Specifica la sintassi personalizzata per analizzare il CSS-in-JS
  customSyntax: 'postcss-styled-syntax',
  // Estende la configurazione standard di Stylelint
  extends: 'stylelint-config-standard',
  plugins: [
    // Usiamo il plugin per ordinare le proprietà
    'stylelint-order'
  ],
  rules: {
    // Aggiungi qui le tue regole personalizzate.
    // L'errore "Unknown word" con le props React può essere ignorato.
    'function-no-unknown': [true, {
      ignoreFunctions: ['css']
    }],
    // Impostazioni per l'ordine delle proprietà
    'order/properties-order': [
      // Proprietà di layout
      'display',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'box-sizing',

      // Proprietà Flexbox e Grid
      'flex',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-wrap',
      'justify-content',
      'align-items',
      'align-content',
      'align-self',
      'order',
      'grid',
      'grid-area',
      'grid-template-rows',
      'grid-template-columns',
      'grid-template-areas',
      'grid-gap',
      'grid-row-gap',
      'grid-column-gap',

      // Proprietà di box model e dimensioni
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'border',
      'border-width',
      'border-style',
      'border-color',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',
      'border-radius',
      'overflow',
      'clip',
      'clear',
      'float',

      // Proprietà tipografiche
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'font-variant',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-decoration',
      'text-transform',
      'white-space',
      'word-break',
      'word-wrap',

      // Proprietà visive e di colore
      'color',
      'background',
      'background-color',
      'background-image',
      'background-position',
      'background-repeat',
      'background-size',
      'box-shadow',
      'text-shadow',
      'opacity',

      // Transizioni e animazioni
      'transition',
      'animation',
      'transform',
      'cursor',

      // Altre proprietà
      'content',
      'list-style',
    ],
  },
};
