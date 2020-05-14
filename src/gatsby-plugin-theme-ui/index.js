export default {
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#e5e5e5',
    secondary: '#666',
    highlight: '#f9f9f9',
  },
  fonts: {
    body: '"Roboto", sans-serif',
    heading: '"Roboto", sans-serif',
    monospace: 'Menlo, monospace',
  },
  fontWeights: {
    body: 200,
    heading: 200,
    bold: 500,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  text: {
    pageTitle: {
      textAlign: 'center',
      variant: 'styles.h4',
    },
    upperCase: {
      textTransform: 'uppercase',
    },
  },
  buttons: {
    primary: {
      color: '#666',
      textTransform: 'uppercase',
      borderRadius: 0,
      boxShadow: 'inset 0 2px 4px #909090',
      pt: '1rem',
      pb: '1rem',
      pr: '1.5rem',
      pl: '1.5rem',
      cursor: 'pointer',
      '&:hover': {
        color: 'inherit',
      },
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    h2: {
      textTransform: 'uppercase',
      fontSize: 24,
      marginBottom: 4,
    },
    h4: {
      textTransform: 'uppercase',
      fontSize: 20,
      marginBottom: 4,
    },
    h5: {
      fontSize: 20,
      marginBottom: 4,
    },
    hr: {
      color: 'primary',
      marginTop: 4,
      marginBottom: 4,
    },
    a: {
      textDecoration: 'none',
      color: '#666',
      '&:hover': {
        color: 'inherit',
      },
    },
  },
};
