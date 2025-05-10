export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, evidenceImages, latitude, longitude }) {
    this.#view.showSubmitLoadingButton();
    try {
      const data = {
        description: description,
        photo: evidenceImages,
        lat: latitude,
        lon: longitude,
      };
      const response = await this.#model.storeNewStory(data);

      if (!response.ok) {
        console.error('postNewStory: response:', response);
        this.#view.storeFailed(response.message);
        return;
      }

      // No need to wait response
      this.#notifyToAllUser();
      
      this.#view.storeSuccessfully(response.message);
    } catch (error) {
      console.error('postNewStory: error:', error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }

  async #notifyToAllUser() {
    try {
      const response = await this.#model.sendStoryToAllUserViaNotification();

      if (!response.ok) {
        console.error('#notifyToAllUser: response:', response);
        return false;
      }

      return true;
    } catch (error) {
      console.error('#notifyToAllUser: error:', error);
      return false;
    }
  }

}
