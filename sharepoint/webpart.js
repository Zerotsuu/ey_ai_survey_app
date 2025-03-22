//AI generated code. Modify as needed. Including the webpart.js file. 

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../src/App';
import '../src/styles/globals.css';
import { sharepointConfig } from '../sharepoint.config';

export default class SurveyFormWebPart extends BaseClientSideWebPart {
  constructor() {
    super();
    // Initialize SharePoint context
    this._root = null;
  }

  render() {
    // Create the React element with SharePoint context
    const element = createElement(App, {
      context: this.context,
      displayMode: this.displayMode,
      updateProperty: (key, value) => {
        this.properties[key] = value;
        this.render();
      },
      properties: this.properties,
      // Pass SharePoint configuration
      sharepointConfig: sharepointConfig
    });

    // Render the React element
    if (!this._root) {
      this._root = createRoot(this.domElement);
    }
    this._root.render(element);
  }

  onDispose() {
    // Clean up when the web part is disposed
    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }
} 