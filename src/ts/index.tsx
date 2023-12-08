import { checkExists } from 'base/preconditions';
import { App } from 'examples/todos/app';
import { createRoot } from 'react-dom/client';

window.addEventListener('load', function () {
  const elementId = 'app';
  const appNode = document.getElementById(elementId);
  const app = createRoot(checkExists(appNode, 'element with id "{0}" not found', elementId));

  app.render(<App/>);
});
