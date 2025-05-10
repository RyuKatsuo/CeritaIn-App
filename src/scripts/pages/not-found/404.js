export default class NotFoundPage {
    async render() {
      return `
        <section class="not-found">
          <h1>404</h1>
          <p>Halaman tidak ditemukan.</p>
        </section>
      `;
    }
  
    afterRender() {
      // Optional: logic tambahan setelah render
    }
  }