document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div') 
    let doodlerLeftSpace = 50;
    let startPoint = 150
    let doodlerBottomSpace = 150;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;

    //creates and positions doodler
    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace +'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }
    //classification of A PLATFORM
    class Platform {
        constructor(newPlatBottom){
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual =  this.visual
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
 
        }
    }

    //generates random platform
    function createPlatform() {
        for(let i=0; i < platformCount; i++) {
            let platGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
        }
    }

    /*
        1. shifts platforms down when doodler jumps
        2. removes platforms from the bottom
        3. adds platforms from the top
        4. keeps score
    */
    function movePlatforms() {
        if(doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom  -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if(platform.bottom < 10) {
                    let firstPlatforrm = platforms[0].visual;
                    firstPlatforrm.classList.remove('platform')
                    platforms.shift();
                    score++;
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform);
                }
            })
        }
    }

    //keeps doodler's range below 350px
    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function() {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px';

            if(doodlerBottomSpace > 350) {
                fall();
            }
        },30)
    };

    /*
        1. drops doodler down
        2. invokes game over when doodler reaches the botom
        3. invokes jump when doodler touches the platform
    */
    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function() {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if(doodlerBottomSpace <= 0) {
                gameOver();
            }
            platforms.forEach(platform => {
                if(
                    (doodlerBottomSpace >= platform.bottom) && 
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    (!isJumping)
                ) {
                    startPoint = doodlerBottomSpace;
                    jump();
                }
            })
            
        },30)
    }

    // ends the game, shows results.
    function gameOver() {
        isGameOver = true;
        while(grid.firstElementChild){
            grid.removeChild(grid.firstChild)
        };
        grid.innerHTML = score
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    //use of the three keys - up,tight,left
    function control(e) {
        if(e.key == 'ArrowLeft') {
            moveLeft();
        } else if (e.key == 'ArrowRight') {
            moveRight();
        } else if(e.key == "ArrowUp") {
            moveStraight();
        }
    }

    //moves doodler left unless it hits left wall
    function moveLeft() {
        if(isGoingRight) {
            clearInterval(leftTimerId);
            isGoingRight = false
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function() {
            if(doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveRight()
            }
        },10)
    }

    //moves doodler right unless it hits right wall
    function moveRight() {
        if(isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false
        }
        isGoingRight = true;
        rightTimerId = setInterval(function() {
            if(doodlerLeftSpace <= 313) {
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveLeft()
            }
        },10)
    }

    //keeps doodler straight, cancels left and right
    function moveStraight() {
        isGoingRight = false;
        isGoingLeft = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    /*
        starts the game.
        arranges the functions so they are invoked in order - 
            1. Create platforms
            2. Create and position doodler
            3. Moves platforms periodically with set interval
            4. Auto-jump
            5. Button input
    */
    function start() {
        if(!isGameOver) {
            createPlatform();
            createDoodler();
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    //key to the engine
    start();

})