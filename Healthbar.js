class Healthbar {

    constructor(agent) {

        Object.assign(this, {agent});

    };

    update() {

    };

    draw(ctx) {

        if (this.agent.hpCurrent < this.agent.hpMax) {

            ctx.fillStyle = rgb(166, 16, 30); // blood red
            var ratio = this.agent.hpCurrent / this.agent.hpMax;
            ctx.fillRect(this.agent.positionx, this.agent.positiony - 7.5, this.agent.width * ratio, 5);

        }

    };

    



};