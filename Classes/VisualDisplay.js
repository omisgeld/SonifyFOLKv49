class VisualDisplay {
  constructor(canvas){
    this._canvas = canvas;
    this._blobs = document.querySelector("#blobs");
    this.relative = true;
    this._ctx = canvas.getContext("2d", { alpha: true });
    this._ctx.lineWidth = 3;
    this.lastUpdate = 0;
    this.lastUsedVariables = [];
    this.initTime = Date.now();

    canvas.addEventListener("click", e => {
      this.switchMode();
    });
  }

  switchMode(){
    this.relative = !this.relative;
    this.draw();
  }


  draw(variables = []){
    


    // prevent overload of drawing from various calling 
    // functions on init
    

    
    let now = Date.now();
    
    if((!variables.length && !this.lastUsedVariables.length) || now - this.lastUpdate < 500){
      // console.log("Exit", variables, Date.now() - this.initTime);
      return;
    } else {
      // console.log("Draw", variables, Date.now() - this.initTime);
    }
    this.lastUpdate = now;

    if(this.lastUsedVariables.length){
      //console.log("Clear graph", Date.now() - this.initTime);
      this.clear();
    }

    //console.log("Draw graph", Date.now() - this.initTime);
    this.lastUsedVariables = variables;

    let globalMin;
    variables.forEach((item, i) => {
      if(typeof globalMin == "undefined"){globalMin = item.min}
      globalMin = Math.min(globalMin, item.min);
    });

    let globalMax;
    variables.forEach((item, i) => {
      if(typeof globalMax == "undefined"){globalMax = item.max}
      globalMax = Math.max(globalMax, item.max);
    });


    variables.forEach(varObj => {
      
      this._ctx.beginPath();
      this._ctx.strokeStyle = varObj.color;

      let xOffset = varObj.minCol;
      let xRange = varObj.maxCol - varObj.minCol;

      let yOffset = this.relative ? varObj.min : globalMin;
      let yRange = this.relative ? varObj.max - varObj.min : globalMax - globalMin;

      let values = varObj.values.filter((item, index) => index % 2 == 0 || true);


      varObj.values.forEach((valueObj, i) => {
        let x = (valueObj.col - xOffset)/xRange * this._canvas.width;
        let y = (1 - (valueObj.val - yOffset)/yRange) * this._canvas.height;
        x = Math.floor(x);
        y = Math.floor(y);

        if(i==0){
          // first point
          this._ctx.moveTo(x,y);
        } else {
          // other points
          //this._ctx.moveTo(x,y);
          this._ctx.lineTo(x,y);
        }


      });
      console.log(`Nr of values for ${varObj.name}: ${varObj.values.length}`);

      this._ctx.stroke();
    });
    // console.log(`Time to draw graph: ${Date.now() - now}`);

  }

  clear(){
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  set gain(vol){
    if(this.targetAudioObject){
      this.targetAudioObject.target.gain = vol;
    }
  }

  addBlob(color){
    let blob = document.createElement("div");
    let blobContainer = document.createElement("div");

    blob.classList.add("blob");
    blob.style.backgroundColor = color;
    blobContainer.classList.add("blobContainer");
    blobContainer.appendChild(blob);
    this._blobs.appendChild(blobContainer);

    blob.animationHeight = blobContainer.getBoundingClientRect().height;
    return blob;
  }
  removeBlob(blob){
    this._blobs.removeChild(blob.parentNode);
  }

}

module.exports = VisualDisplay;
