import icons from '../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @return {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   */
  
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // creates a virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // elements from the virtual DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // elements on the current/actual DOM
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    // compare the current elements to the new elements
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      // updates changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //   updates changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
       <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
     `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = ` 
      <div class="error">
          <div style="display: flex; place-items:center">
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
          </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = ` 
          <div class="message">
            <div style="display: flex; place-items:center">
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
