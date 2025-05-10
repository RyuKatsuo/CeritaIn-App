import { storyMapper } from "../../data/api-mapper.js";

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #dbModel;

  constructor(storyId, { view, apiModel, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoryDetailMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#apiModel.getStoryById(this.#storyId);
      
      if (!response.ok) {
        
        console.error('showStoryDetail: response:', response);
        this.#view.populateStoryDetailError(response.message);
        return;
      }
      
      const story = await storyMapper(response.story);

      
      this.#view.populateStoryDetailAndInitialMap(response.message, story);
    } catch (error) {
      console.error('showStoryDetail: error:', error);
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }

  async saveReport() {
    try {
      const story = await this.#apiModel.getStoryById(this.#storyId);
      await this.#dbModel.putStory(story.story);
 
      this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');
    } catch (error) {
      console.error('saveStory: error:', error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeReport() {
    try {
      console.log(this.#storyId, 'story pres');
      
      await this.#dbModel.removeStory(this.#storyId);
      this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
    } catch (error) {
      console.error('removeReport: error:', error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }

  async #isReportSaved() {
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
