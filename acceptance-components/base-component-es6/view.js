import styles from './styles.css';

export default ({ name, staticPath }) =>
  `<div id="base-component-es6" class=${styles.awesome}>
    Hello ${name.toUpperCase()}!
    <img src="${staticPath}img/logo.png" />
  </div>`;
