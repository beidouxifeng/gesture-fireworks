/*
 * Firework Core - 从 Firework_Simulator 提取的核心烟花逻辑
 * 移除了音频依赖，保留完整的烟花效果
 */

const COLOR = {
    Red: "#ff0043",
    Green: "#14fc56",
    Blue: "#1e7fff",
    Purple: "#e60aff",
    Gold: "#ffbf36",
    White: "#ffffff",
};

const COLOR_NAMES = Object.keys(COLOR);
const COLOR_CODES = COLOR_NAMES.map((colorName) => COLOR[colorName]);
const COLOR_CODES_W_INVIS = [...COLOR_CODES, "_INVISIBLE_"];
const INVISIBLE = "_INVISIBLE_";

const COLOR_TUPLES = {};
COLOR_CODES.forEach((hex) => {
    COLOR_TUPLES[hex] = {
        r: parseInt(hex.substr(1, 2), 16),
        g: parseInt(hex.substr(3, 2), 16),
        b: parseInt(hex.substr(5, 2), 16),
    };
});

const GRAVITY = 0.9;
const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;

let stageW = window.innerWidth;
let stageH = window.innerHeight;

let quality = 3;
const QUALITY_HIGH = 3;

function randomColorSimple() {
    return COLOR_CODES[(Math.random() * COLOR_CODES.length) | 0];
}

let lastColor;
function randomColor(options) {
    const notSame = options && options.notSame;
    const notColor = options && options.notColor;
    const limitWhite = options && options.limitWhite;
    let color = randomColorSimple();

    if (limitWhite && color === COLOR.White && Math.random() < 0.6) {
        color = randomColorSimple();
    }

    if (notSame) {
        while (color === lastColor) {
            color = randomColorSimple();
        }
    } else if (notColor) {
        while (color === notColor) {
            color = randomColorSimple();
        }
    }

    lastColor = color;
    return color;
}

function makePistilColor(shellColor) {
    return shellColor === COLOR.White || shellColor === COLOR.Gold ? randomColor({ notColor: shellColor }) : (Math.random() < 0.5 ? COLOR.Gold : COLOR.White);
}

// Shell types
const crysanthemumShell = (size = 1) => {
    const glitter = Math.random() < 0.25;
    const singleColor = Math.random() < 0.72;
    const color = singleColor ? randomColor({ limitWhite: true }) : [randomColor(), randomColor({ notSame: true })];
    const pistil = singleColor && Math.random() < 0.42;
    const pistilColor = pistil && makePistilColor(color);
    const secondColor = singleColor && (Math.random() < 0.2 || color === COLOR.White) ? pistilColor || randomColor({ notColor: color, limitWhite: true }) : null;
    const streamers = !pistil && color !== COLOR.White && Math.random() < 0.42;
    let starDensity = glitter ? 1.1 : 1.25;
    if (quality === QUALITY_HIGH) starDensity = 1.2;
    return {
        shellSize: size,
        spreadSize: 300 + size * 100,
        starLife: 900 + size * 200,
        starDensity,
        color,
        secondColor,
        glitter: glitter ? "light" : "",
        glitterColor: makePistilColor(color),
        pistil,
        pistilColor,
        streamers,
    };
};

const ghostShell = (size = 1) => {
    const shell = crysanthemumShell(size);
    shell.starLife *= 1.5;
    let ghostColor = randomColor({ notColor: COLOR.White });
    shell.streamers = true;
    const pistil = Math.random() < 0.42;
    const pistilColor = pistil && makePistilColor(ghostColor);
    shell.color = INVISIBLE;
    shell.secondColor = ghostColor;
    shell.glitter = "";
    return shell;
};

const strobeShell = (size = 1) => {
    const color = randomColor({ limitWhite: true });
    return {
        shellSize: size,
        spreadSize: 280 + size * 92,
        starLife: 1100 + size * 200,
        starLifeVariation: 0.4,
        starDensity: 1.1,
        color,
        glitter: "light",
        glitterColor: COLOR.White,
        strobe: true,
        strobeColor: Math.random() < 0.5 ? COLOR.White : null,
        pistil: Math.random() < 0.5,
        pistilColor: makePistilColor(color),
    };
};

const palmShell = (size = 1) => {
    const color = randomColor();
    const thick = Math.random() < 0.5;
    return {
        shellSize: size,
        color,
        spreadSize: 250 + size * 75,
        starDensity: thick ? 0.15 : 0.4,
        starLife: 1800 + size * 200,
        glitter: thick ? "thick" : "heavy",
    };
};

const ringShell = (size = 1) => {
    const color = randomColor();
    const pistil = Math.random() < 0.75;
    return {
        shellSize: size,
        ring: true,
        color,
        spreadSize: 300 + size * 100,
        starLife: 900 + size * 200,
        starCount: 2.2 * PI_2 * (size + 1),
        pistil,
        pistilColor: makePistilColor(color),
        glitter: !pistil ? "light" : "",
        glitterColor: color === COLOR.Gold ? COLOR.Gold : COLOR.White,
        streamers: Math.random() < 0.3,
    };
};

const crossetteShell = (size = 1) => {
    const color = randomColor({ limitWhite: true });
    return {
        shellSize: size,
        spreadSize: 300 + size * 100,
        starLife: 750 + size * 160,
        starLifeVariation: 0.4,
        starDensity: 0.85,
        color,
        crossette: true,
        pistil: Math.random() < 0.5,
        pistilColor: makePistilColor(color),
    };
};

const floralShell = (size = 1) => ({
    shellSize: size,
    spreadSize: 300 + size * 120,
    starDensity: 0.12,
    starLife: 500 + size * 50,
    starLifeVariation: 0.5,
    color: Math.random() < 0.65 ? "random" : Math.random() < 0.15 ? randomColor() : [randomColor(), randomColor({ notSame: true })],
    floral: true,
});

const fallingLeavesShell = (size = 1) => ({
    shellSize: size,
    color: INVISIBLE,
    spreadSize: 300 + size * 120,
    starDensity: 0.12,
    starLife: 500 + size * 50,
    starLifeVariation: 0.5,
    glitter: "medium",
    glitterColor: COLOR.Gold,
    fallingLeaves: true,
});

const willowShell = (size = 1) => ({
    shellSize: size,
    spreadSize: 300 + size * 100,
    starDensity: 0.6,
    starLife: 3000 + size * 300,
    glitter: "willow",
    glitterColor: COLOR.Gold,
    color: INVISIBLE,
});

const crackleShell = (size = 1) => {
    const color = Math.random() < 0.75 ? COLOR.Gold : randomColor();
    return {
        shellSize: size,
        spreadSize: 380 + size * 75,
        starDensity: 1,
        starLife: 600 + size * 100,
        starLifeVariation: 0.32,
        glitter: "light",
        glitterColor: COLOR.Gold,
        color,
        crackle: true,
        pistil: Math.random() < 0.65,
        pistilColor: makePistilColor(color),
    };
};

const horsetailShell = (size = 1) => {
    const color = randomColor();
    return {
        shellSize: size,
        horsetail: true,
        color,
        spreadSize: 250 + size * 38,
        starDensity: 0.9,
        starLife: 2500 + size * 300,
        glitter: "medium",
        glitterColor: Math.random() < 0.5 ? makePistilColor(color) : color,
        strobe: color === COLOR.White,
    };
};

function randomShellName() {
    return Math.random() < 0.5 ? "Crysanthemum" : shellNames[(Math.random() * (shellNames.length - 1) + 1) | 0];
}

function randomShell(size) {
    return shellTypes[randomShellName()](size);
}

const shellTypes = {
    Random: randomShell,
    Crackle: crackleShell,
    Crossette: crossetteShell,
    Crysanthemum: crysanthemumShell,
    "Falling Leaves": fallingLeavesShell,
    Floral: floralShell,
    Ghost: ghostShell,
    "Horse Tail": horsetailShell,
    Palm: palmShell,
    Ring: ringShell,
    Strobe: strobeShell,
    Willow: willowShell,
};

const shellNames = Object.keys(shellTypes);
let shellSizeSelector = () => 2;

function shellFromConfig(size) {
    return shellTypes[randomShellName()](size);
}

// BurstFlash
const BurstFlash = {
    active: [],
    _pool: [],
    add(x, y, radius) {
        const instance = this._pool.pop() || {};
        instance.x = x;
        instance.y = y;
        instance.radius = radius;
        this.active.push(instance);
    },
    returnInstance(instance) {
        this._pool.push(instance);
    },
    render(ctx) {
        this.active.forEach((bf) => {
            const gradient = ctx.createRadialGradient(bf.x, bf.y, 0, bf.x, bf.y, bf.radius);
            gradient.addColorStop(0.024, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.125, "rgba(255, 160, 20, 0.2)");
            gradient.addColorStop(0.32, "rgba(255, 140, 20, 0.11)");
            gradient.addColorStop(1, "rgba(255, 120, 20, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(bf.x - bf.radius, bf.y - bf.radius, bf.radius * 2, bf.radius * 2);
            this.returnInstance(bf);
        });
        this.active = [];
    }
};

// Spark
const Spark = {
    drawWidth: 0.75,
    airDrag: 0.9,
    active: {},
    _pool: [],
    _new() { return {}; },
    init() {
        COLOR_CODES.forEach((color) => { this.active[color] = []; });
    },
    add(x, y, color, angle, speed, life) {
        const instance = this._pool.pop() || this._new();
        instance.x = x;
        instance.y = y;
        instance.prevX = x;
        instance.prevY = y;
        instance.color = color;
        instance.speedX = Math.sin(angle) * speed;
        instance.speedY = Math.cos(angle) * speed;
        instance.life = life;
        this.active[color].push(instance);
        return instance;
    },
    returnInstance(instance) {
        this._pool.push(instance);
    }
};

// Star
const Star = {
    airDrag: 0.98,
    airDragHeavy: 0.992,
    active: {},
    _pool: [],
    _new() { return {}; },
    init() {
        COLOR_CODES_W_INVIS.forEach((color) => { this.active[color] = []; });
    },
    add(x, y, color, angle, speed, life, speedOffX, speedOffY, size = 3) {
        const instance = this._pool.pop() || this._new();
        instance.visible = true;
        instance.heavy = false;
        instance.x = x;
        instance.y = y;
        instance.prevX = x;
        instance.prevY = y;
        instance.color = color;
        instance.speedX = Math.sin(angle) * speed + (speedOffX || 0);
        instance.speedY = Math.cos(angle) * speed + (speedOffY || 0);
        instance.life = life;
        instance.fullLife = life;
        instance.size = size;
        instance.spinAngle = Math.random() * PI_2;
        instance.spinSpeed = 0.8;
        instance.spinRadius = 0;
        instance.sparkFreq = 0;
        instance.sparkSpeed = 1;
        instance.sparkTimer = 0;
        instance.sparkColor = color;
        instance.sparkLife = 750;
        instance.sparkLifeVariation = 0.25;
        instance.strobe = false;
        instance.onDeath = null;
        instance.secondColor = null;
        instance.transitionTime = 0;
        instance.colorChanged = false;
        this.active[color].push(instance);
        return instance;
    },
    returnInstance(instance) {
        if (instance.onDeath) instance.onDeath(instance);
        instance.onDeath = null;
        instance.secondColor = null;
        instance.transitionTime = 0;
        instance.colorChanged = false;
        this._pool.push(instance);
    }
};

// Effects
function crossetteEffect(star) {
    const startAngle = Math.random() * PI_HALF;
    createParticleArc(startAngle, PI_2, 4, 0.5, (angle) => {
        Star.add(star.x, star.y, star.color, angle, Math.random() * 0.6 + 0.75, 600);
    });
}

function floralEffect(star) {
    const count = 12 + 6 * quality;
    createBurst(count, (angle, speedMult) => {
        Star.add(star.x, star.y, star.color, angle, speedMult * 2.4, 1000 + Math.random() * 300, star.speedX, star.speedY);
    });
    BurstFlash.add(star.x, star.y, 46);
}

function fallingLeavesEffect(star) {
    createBurst(7, (angle, speedMult) => {
        const newStar = Star.add(star.x, star.y, INVISIBLE, angle, speedMult * 2.4, 2400 + Math.random() * 600, star.speedX, star.speedY);
        newStar.sparkColor = COLOR.Gold;
        newStar.sparkFreq = 144 / quality;
        newStar.sparkSpeed = 0.28;
        newStar.sparkLife = 750;
        newStar.sparkLifeVariation = 3.2;
    });
    BurstFlash.add(star.x, star.y, 46);
}

function crackleEffect(star) {
    const count = 32;
    createParticleArc(0, PI_2, count, 1.8, (angle) => {
        Spark.add(star.x, star.y, COLOR.Gold, angle, Math.pow(Math.random(), 0.45) * 2.4, 300 + Math.random() * 200);
    });
}

function createParticleArc(start, arcLength, count, randomness, particleFactory) {
    const angleDelta = arcLength / count;
    const end = start + arcLength - angleDelta * 0.5;
    if (end > start) {
        for (let angle = start; angle < end; angle = angle + angleDelta) {
            particleFactory(angle + Math.random() * angleDelta * randomness);
        }
    } else {
        for (let angle = start; angle > end; angle = angle + angleDelta) {
            particleFactory(angle + Math.random() * angleDelta * randomness);
        }
    }
}

function createBurst(count, particleFactory, startAngle = 0, arcLength = PI_2) {
    const R = 0.5 * Math.sqrt(count / Math.PI);
    const C = 2 * R * Math.PI;
    const C_HALF = C / 2;
    for (let i = 0; i <= C_HALF; i++) {
        const ringAngle = (i / C_HALF) * PI_HALF;
        const ringSize = Math.cos(ringAngle);
        const partsPerFullRing = C * ringSize;
        const partsPerArc = partsPerFullRing * (arcLength / PI_2);
        const angleInc = PI_2 / partsPerFullRing;
        const angleOffset = Math.random() * angleInc + startAngle;
        const maxRandomAngleOffset = angleInc * 0.33;
        for (let i = 0; i < partsPerArc; i++) {
            const randomAngleOffset = Math.random() * maxRandomAngleOffset;
            const angle = angleInc * i + angleOffset + randomAngleOffset;
            particleFactory(angle, ringSize);
        }
    }
}

// Shell class
class Shell {
    constructor(options) {
        Object.assign(this, options);
        this.starLifeVariation = options.starLifeVariation || 0.125;
        this.color = options.color || randomColor();
        this.glitterColor = options.glitterColor || this.color;
        this.disableWord = options.disableWord || false;

        if (!this.starCount) {
            const density = options.starDensity || 1;
            const scaledSize = this.spreadSize / 54;
            this.starCount = Math.max(6, scaledSize * scaledSize * density);
        }
    }

    launch(position, launchHeight) {
        const width = stageW;
        const height = stageH;
        const hpad = 60;
        const vpad = 50;
        const minHeightPercent = 0.45;
        const minHeight = height - height * minHeightPercent;

        const launchX = position * (width - hpad * 2) + hpad;
        const launchY = height;
        const burstY = minHeight - launchHeight * (minHeight - vpad);
        const launchDistance = launchY - burstY;
        const launchVelocity = Math.pow(launchDistance * 0.04, 0.64);

        const comet = Star.add(
            launchX, launchY,
            typeof this.color === "string" && this.color !== "random" ? this.color : COLOR.White,
            Math.PI,
            launchVelocity * (this.horsetail ? 1.2 : 1),
            launchVelocity * (this.horsetail ? 100 : 400)
        );
        comet.heavy = true;
        comet.spinRadius = 0.32 + Math.random() * 0.53;
        comet.sparkFreq = 32 / quality;
        if (quality === QUALITY_HIGH) comet.sparkFreq = 8;
        comet.sparkLife = 320;
        comet.sparkLifeVariation = 3;
        if (this.glitter === "willow" || this.fallingLeaves) {
            comet.sparkFreq = 20 / quality;
            comet.sparkSpeed = 0.5;
            comet.sparkLife = 500;
        }
        if (this.color === INVISIBLE) {
            comet.sparkColor = COLOR.Gold;
        }
        if (Math.random() > 0.4 && !this.horsetail) {
            comet.secondColor = INVISIBLE;
            comet.transitionTime = Math.pow(Math.random(), 1.5) * 700 + 500;
        }

        const self = this;
        comet.onDeath = (c) => self.burst(c.x, c.y);
    }

    burst(x, y) {
        const speed = this.spreadSize / 96;
        let color, onDeath, sparkFreq, sparkSpeed, sparkLife;
        let sparkLifeVariation = 0.25;
        let playedDeathSound = false;

        if (this.crossette) {
            onDeath = (star) => {
                crossetteEffect(star);
            };
        }
        if (this.crackle) {
            onDeath = (star) => {
                crackleEffect(star);
            };
        }
        if (this.floral) onDeath = floralEffect;
        if (this.fallingLeaves) onDeath = fallingLeavesEffect;

        if (this.glitter === "light") {
            sparkFreq = 400; sparkSpeed = 0.3; sparkLife = 300; sparkLifeVariation = 2;
        } else if (this.glitter === "medium") {
            sparkFreq = 200; sparkSpeed = 0.44; sparkLife = 700; sparkLifeVariation = 2;
        } else if (this.glitter === "heavy") {
            sparkFreq = 80; sparkSpeed = 0.8; sparkLife = 1400; sparkLifeVariation = 2;
        } else if (this.glitter === "thick") {
            sparkFreq = 16; sparkSpeed = 1.5; sparkLife = 1400; sparkLifeVariation = 3;
        } else if (this.glitter === "streamer") {
            sparkFreq = 32; sparkSpeed = 1.05; sparkLife = 620; sparkLifeVariation = 2;
        } else if (this.glitter === "willow") {
            sparkFreq = 120; sparkSpeed = 0.34; sparkLife = 1400; sparkLifeVariation = 3.8;
        }

        sparkFreq = sparkFreq / quality;

        const self = this;
        const starFactory = (angle, speedMult) => {
            const standardInitialSpeed = this.spreadSize / 1800;
            const star = Star.add(
                x, y,
                color || randomColor(),
                angle,
                speedMult * speed,
                this.starLife + Math.random() * this.starLife * this.starLifeVariation,
                this.horsetail ? this.comet && this.comet.speedX : 0,
                this.horsetail ? this.comet && this.comet.speedY : -standardInitialSpeed
            );
            if (this.secondColor) {
                star.transitionTime = this.starLife * (Math.random() * 0.05 + 0.32);
                star.secondColor = this.secondColor;
            }
            if (this.strobe) {
                star.transitionTime = this.starLife * (Math.random() * 0.08 + 0.46);
                star.strobe = true;
                star.strobeFreq = Math.random() * 20 + 40;
                if (this.strobeColor) {
                    star.secondColor = this.strobeColor;
                }
            }
            star.onDeath = onDeath;
            if (this.glitter) {
                star.sparkFreq = sparkFreq;
                star.sparkSpeed = sparkSpeed;
                star.sparkLife = sparkLife;
                star.sparkLifeVariation = sparkLifeVariation;
                star.sparkColor = this.glitterColor;
                star.sparkTimer = Math.random() * star.sparkFreq;
            }
        };

        if (typeof this.color === "string") {
            if (this.color === "random") {
                color = null;
            } else {
                color = this.color;
            }
            if (this.ring) {
                const ringStartAngle = Math.random() * Math.PI;
                const ringSquash = Math.pow(Math.random(), 2) * 0.85 + 0.15;
                createParticleArc(0, PI_2, this.starCount, 0, (angle) => {
                    const initSpeedX = Math.sin(angle) * speed * ringSquash;
                    const initSpeedY = Math.cos(angle) * speed;
                    const newSpeed = Math.sqrt(initSpeedX * initSpeedX + initSpeedY * initSpeedY);
                    const newAngle = Math.atan2(initSpeedX, initSpeedY) + ringStartAngle;
                    const star = Star.add(x, y, color, newAngle, newSpeed, this.starLife + Math.random() * this.starLife * this.starLifeVariation);
                    if (this.glitter) {
                        star.sparkFreq = sparkFreq;
                        star.sparkSpeed = sparkSpeed;
                        star.sparkLife = sparkLife;
                        star.sparkLifeVariation = sparkLifeVariation;
                        star.sparkColor = this.glitterColor;
                        star.sparkTimer = Math.random() * star.sparkFreq;
                    }
                });
            } else {
                createBurst(this.starCount, starFactory);
            }
        } else if (Array.isArray(this.color)) {
            if (Math.random() < 0.5) {
                const start = Math.random() * Math.PI;
                const start2 = start + Math.PI;
                const arc = Math.PI;
                color = this.color[0];
                createBurst(this.starCount, starFactory, start, arc);
                color = this.color[1];
                createBurst(this.starCount, starFactory, start2, arc);
            } else {
                color = this.color[0];
                createBurst(this.starCount / 2, starFactory);
                color = this.color[1];
                createBurst(this.starCount / 2, starFactory);
            }
        }

        if (this.pistil) {
            const innerShell = new Shell({
                spreadSize: this.spreadSize * 0.5,
                starLife: this.starLife * 0.6,
                starLifeVariation: this.starLifeVariation,
                starDensity: 1.4,
                color: this.pistilColor,
                glitter: "light",
                disableWord: true,
                glitterColor: this.pistilColor === COLOR.Gold ? COLOR.Gold : COLOR.White,
            });
            innerShell.burst(x, y);
        }

        if (this.streamers) {
            const innerShell = new Shell({
                spreadSize: this.spreadSize * 0.9,
                starLife: this.starLife * 0.8,
                starLifeVariation: this.starLifeVariation,
                starCount: Math.floor(Math.max(6, this.spreadSize / 45)),
                color: COLOR.White,
                disableWord: true,
                glitter: "streamer",
            });
            innerShell.burst(x, y);
        }

        BurstFlash.add(x, y, this.spreadSize / 4);
    }
}

// 导出到全局
window.FireworkCore = {
    Shell,
    Star,
    Spark,
    BurstFlash,
    COLOR,
    COLOR_CODES,
    stageW,
    stageH,
    shellSizeSelector,
    shellFromConfig
};
