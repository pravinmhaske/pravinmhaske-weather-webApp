class UIGenerater {

    constructor() {
        this.uiFooterContainer = document.getElementById("footer");

    }
    generateHeader() {
        //implement this
    }

    generateMainContent() {
        //implement this
    }

    generateFooter() {
        this.uiFooterContainer.innerHTML = `
        <div class="text-center">
        <div class="content">
          <div class="row">
            <div class="col"></div>
            <div class="col"></div>
            <div class="col-md-4 col-lg-4 col-sm-2 col-xs-2">
              <div class="field is-grouped">
  
                <!-- Facebook -->
                <p class="control">
                  <a class="button is-custom-button-social" href="https://www.facebook.com/pravinm43">
                    <span class="icon">
                      <i class="fab  fa-facebook-f "></i>
                    </span>
                  </a>
                </p>
  
  
                <!-- GitHub -->
                <p class="control">
                  <a class="button is-custom-button-social" href="https://github.com/pravinmhaske">
                    <span class="icon">
                      <i class="fab  fa-github"></i>
                    </span>
                  </a>
                </p>
  
                <!-- LinkedIn -->
                <p class="control">
                  <a class="button is-custom-button-social" href="https://www.linkedin.com/in/pravinmhaske997/">
                    <span class="icon">
                      <i class="fab  fa-linkedin-in"></i>
                    </span>
                  </a>
                </p>
  
                <!-- Mail -->
                <p class="control">
                  <a class="button is-custom-button-social" href="mailto:pravinmhaske997@gmai.com">
                    <span class="icon">
                      <i class="fas fa-envelope"></i>
                    </span>
                  </a>
                </p>
  
              </div>
            </div>
            <div class="col"></div>
            <div class="col"></div>
          </div>
  
          <!-- Copyright -->
          <p class="has-text-centered">
            Made with <span class="icon is-custom-icon-heart"><i class="fas fa-heart"></i></span> By
          <p>Pravin Mhaske</p> <span id="copyright"></span>
          </p>
        </div>
      </div>
        `;
    }


}