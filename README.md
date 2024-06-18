## About

PostCSS plugin which transforms colors into individual `rrr, ggg, bbb` values for use in contextual or theme-aware colors.
When using with TailwindCSS, this plugin needs to run after Tailwind.

### Example

**In your `postcss.config.js`**

```js
module.exports = {
  "tailwindcss": {},
  "postcss-plugin-rgbstring": {},
  "autoprefixer": {},
};
```

**In your css**

```css
@layer base {
  :root {
    --bg-primary: rgbstring(theme(colors.gray.100));
    --text-primary: rgbstring(#111);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-primary: rgbstring(theme(colors.gray.900));
      --text-primary: rgbstring(#eee);
    }
  }
}
```

**In your tailwind config**

```js
function fromVariable(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined)
      return `rgba(var(${variableName}), ${opacityValue})`;
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  theme: {
    backgroundColor: {
      primary: fromVariable("--bg-primary"),
    },
    textColor: {
      primary: fromVariable("--text-primary"),
    },
  },
};
```

**In your template**

```html
<div class="bg-primary text-primary">Content</div>
```
