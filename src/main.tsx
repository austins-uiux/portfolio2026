import ReactDOM from 'react-dom/client';
import { Root } from './Root';
import './styles/index.css';

const container = document.getElementById('root')!;
const initialLocation = container.dataset.initialLocation ?? window.location.pathname + window.location.search;
const app = <Root initialLocation={initialLocation} />;
if (container.hasChildNodes()) ReactDOM.hydrateRoot(container, app);
else ReactDOM.createRoot(container).render(app);
