var canvas = document.getElementById("bg");

// Create the application and start the update loop
var app = new pc.Application(canvas, {
  mouse: new pc.Mouse(canvas),
  keyboard: new pc.Keyboard(window)
});
app.start();

// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

window.addEventListener("resize", function () {
  app.resizeCanvas(canvas.width, canvas.height);
});

var assets = [
  new pc.Asset("playcanvas-spine.3.8.js", "script", { url: "../lib/playcanvas-spine.3.8.js" }),
  new pc.Asset("bg.atlas", "text", { url: "data/bg.atlas" }),
  new pc.Asset("bg.json", "json", { url: "data/bg.json" }),
  new pc.Asset("bg.png", "texture", { url: "data/bg.png" }),
  new pc.Asset("bg2.png", "texture", { url: "data/bg2.png" })
];

var preload = function (assets, callback) {
  var count = 0;

  for (var i = 0; i < assets.length; i++) {
    app.assets.add(assets[i]);
    assets[i].ready(function (asset) {
      count++;
      if (count === assets.length) {
        callback();
      }
    });
    app.assets.load(assets[i]);
  }
};

preload(assets, function () {
  // Control script for the hero character
  var HeroControls = pc.createScript("heroControls");
  // var HeroControls2 = pc.createScript("heroControls2");

  HeroControls.prototype.initialize = function () {
      this.state = "idle";
  };

  HeroControls.prototype.update = function (dt) {
    var keyboard = this.app.keyboard;
    var spine = this.entity.spine;
     if (keyboard.isPressed(pc.KEY_SPACE)) {
      if (this.state !== "attack") {
        spine.state.setAnimation(0, "fence_base_idle", true);
        this.state = "attack";
      }

    }else if (keyboard.wasPressed(pc.KEY_DOWN)) {
      if (this.state !== "down") {
        spine.state.setAnimation(1, "fence_base_idle", false);
        this.state = "down";

      }
    } else if (keyboard.isPressed(pc.KEY_UP)) {
      if (this.state !== "up") {
        spine.state.setAnimation(2, "fence_base_slow", false);
        this.state = "up";
      }

    } else {
      if (this.state !== "idle") {
        spine.state.setAnimation(3, "fence_base_idle", true);
        this.state = "idle";
      }
      }
    }

    // Create the hero character
    var hero = new pc.Entity();
    hero.addComponent("spine", {
      atlasAsset: assets[1].id,
      skeletonAsset: assets[2].id,
      textureAssets: [ assets[3].id ]
    });
    hero.addComponent("script");
    hero.script.create("heroControls");
    app.root.addChild(hero);

    hero.spine.state.defaultMix = 0.2;
    bg.spine.state.data.setMix("fence_base_idle", "fence_base_slow", 0.2);
    bg.spine.state.data.setMix("fence_base_slow", "fence_base_fast", 0.2);
    bg.spine.state.data.setMix("fence_base_fast", "fence_bonus_fast", 0.5);
    bg.spine.state.data.setMix("fence_bonus_idle", "fence_bonus_slow", 0.4);

    hero.spine.spine.skeleton.setSkinByName("default");
    hero.spine.spine.skeleton.setSlotsToSetupPose();
    hero.spine.state.setAnimation(0, "fence_base_idle", true);

    hero.spine.states[1] = new spine.AnimationState(hero.spine.spine.stateData);
    
   

    // Create a camera to render the scene
    var camera = new pc.Entity();
    camera.addComponent("camera");
    camera.translateLocal(0, 2, 10);
    app.root.addChild(camera);
});
