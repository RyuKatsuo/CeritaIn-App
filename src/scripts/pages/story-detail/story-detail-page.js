import {
  generateLoaderAbsoluteTemplate,
  generateStoriesDetailErrorTemplate,
  generateStoriesDetailTemplate,
  generateSaveStoryButtonTemplate,
  generateRemoveStoryButtonTemplate,
} from '../../templates.js';
import StoryDetailPresenter from './story-detail-presenter.js';
import { parseActivePathname } from '../../routes/url-parser.js';
import Map from '../../utils/map.js';
import * as CeritaInAPI from '../../data/api.js';
import Database from '../../data/database.js';

export default class StoryDetailPage {
  #presenter = null;
  #map = null;



  async render() {
    return `
      <section>
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
      
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: CeritaInAPI,
      dbModel: Database
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    console.log(story, 'reporrrt');
    
    document.getElementById('story-detail').innerHTML = generateStoriesDetailTemplate({
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
      location: story.location.placeName,
    });

    // Map
    await this.#presenter.showStoryDetailMap();
    if(this.#map) {
      const storyCoordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.title };
      const popupOptions = { content: story.title };

      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    }

    //actions buttons
    this.#presenter.showSaveButton();
  }

  populateStoryDetailError(message) {
    document.getElementById('stories-detail').innerHTML = generateStoriesDetailErrorTemplate(message);
  }

  async initialMap() {
    // TODO: map initialization
    this.#map = await Map.build('#map', {
      zoom: 15,
    })
  }


  showStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message){
    console.log(message);
  }

  saveToBookmarkFailed(message){
    alert(message);
  }


  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveStoryButtonTemplate();
 
    document.getElementById('story-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeReport();
      await this.#presenter.showSaveButton();
    });
  }
  
  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }
  
  removeFromBookmarkFailed(message) {
    alert(message);
  }
}
