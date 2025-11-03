//
// Seesaw Simulation 
//
class SeesawSim {
    

    constructor() {


        this.plank_length = 520;
        this.max_angle = 30;
        this.plank_angle = 0;
        this.objects = [];
        

        this.seesaw_screen = document.getElementById('seesawContainer');
        this.seesaw_plank = document.getElementById('seesawPlank');
        this.next_weight = this.generateNextWeight();


        this.seesaw_angle = document.getElementById('angle');
        this.right_side_weight = document.getElementById('rightWeight');
        this.left_side_weight = document.getElementById('leftWeight');
        this.next_weight_stat = document.getElementById('nextWeightStat');


        this.resetButton = document.getElementById('resetButton');

        this.creationSound = new Audio('assets/audio/creation_effect.mp3');
        this.resetSound = new Audio('assets/audio/reset.mp3');

        this.loadState();
        this.init();
    }




    init() {
        this.seesaw_screen.addEventListener('click', (e) => this.handleClick(e));
        this.resetButton.addEventListener('click', () => this.reset());
        this.animate();
    }

    

    generateNextWeight() {
        return Math.floor(Math.random() * 10) + 1;
    }

    backupstate() {
        let object_states = [];
        for (let i = 0; i < this.objects.length; i++) {
            object_states.push({
                distanceFromPivot: this.objects[i].distanceFromPivot,
                weight: this.objects[i].weight,
                size: this.objects[i].size
            });
        }
        localStorage.setItem('backup', JSON.stringify({objects: object_states}));
    }

    loadState() {
        const savedData = localStorage.getItem('backup');
        if (!savedData) return;
        
        const parsed = JSON.parse(savedData);
            for (let i = 0; i < parsed.objects.length; i++) {
                let obj = parsed.objects[i];
                this.addObject(obj.distanceFromPivot, obj.weight);
            }
    }

    reset() {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].element.remove();
        }
        this.objects = [];
        this.plank_angle = 0;
        this.seesaw_plank.style.transform = `translateX(-50%) translateY(-50%) rotate(0deg)`;
        this.seesaw_angle.textContent = '0°';
        this.right_side_weight.textContent = '0 kg';
        this.left_side_weight.textContent = '0 kg';
        this.next_weight_stat.textContent = '0 kg';
        localStorage.removeItem('backup');
        
        this.resetSound.currentTime = 0;
        this.resetSound.play();
    }

    getObjectPosition(dist) {

        let container_width = this.seesaw_screen.offsetWidth;
        let container_height = this.seesaw_screen.offsetHeight;
        let px = container_width / 2;
        let py = container_height / 2;

        let rad = this.plank_angle * Math.PI / 180;

        let posX = px + dist * Math.cos(rad);
        let posY = py + dist * Math.sin(rad) - 15;
        
        return { x: posX, y: posY };

    }

    handleClick(e) {

        const rect = this.seesaw_screen.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
            return;
        }

        const pivotX = rect.width / 2;
        const pivotY = rect.height / 2;
        const clickX = x - pivotX;
        const clickY = y - pivotY;

        const angleRad = (this.plank_angle * Math.PI) / 180;
        const plankX = clickX * Math.cos(-angleRad) - clickY * Math.sin(-angleRad); 

        if (Math.abs(plankX) > this.plank_length / 2) {
            return;
        }

        let weight = this.next_weight;
        this.addObject(plankX, weight);
        this.next_weight = this.generateNextWeight();

    }

    addObject(distanceFromPivot, weight) {

        let size = 60 + weight * 2;

        let pos = this.getObjectPosition(distanceFromPivot);
        let x = pos.x;
        let y = pos.y;

        let element = document.createElement('div');
        element.className = 'object';
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.left = (x - size / 2) + 'px';
        element.style.top = (y - size / 2) + 'px';
        element.textContent = weight + 'kg';
        this.seesaw_screen.appendChild(element);

        this.objects.push({
            distanceFromPivot: distanceFromPivot,
            weight: weight,
            size: size,
            element: element
        });
        
        this.creationSound.currentTime = 0;
        this.creationSound.play();
        
        this.backupstate();
    }

    calculateTorque() {
        let leftTorque = 0;
        let rightTorque = 0;

        this.objects.forEach(obj => {
            let torque = obj.weight * obj.distanceFromPivot;
            
            if (obj.distanceFromPivot < 0) {
                leftTorque += Math.abs(torque);
            } else {
                rightTorque += torque;
            }

        });

        return { leftTorque, rightTorque };
    }
    calculatePlankAngle() {
        const { leftTorque, rightTorque } = this.calculateTorque();
        this.plank_angle = Math.max(-this.max_angle, Math.min(this.max_angle, (rightTorque - leftTorque) / 10));
    }

    calculateWeights() {
        let leftWeight = 0;
        let rightWeight = 0;

        this.objects.forEach(obj => {
            if (obj.distanceFromPivot < 0) {
                leftWeight += obj.weight;
            } else {
                rightWeight += obj.weight;
            }
        });

        return { leftWeight, rightWeight };
    }


    updateVisuals() {
        this.seesaw_plank.style.transform = `translateX(-50%) translateY(-50%) rotate(${this.plank_angle}deg)`;

        this.objects.forEach(obj => {
            const { x, y } = this.getObjectPosition(obj.distanceFromPivot);

            obj.element.style.left = (x - obj.size / 2) + 'px';
            obj.element.style.top = (y - obj.size / 2) + 'px';
            
        });

    }

    updateStats() {
        
        const { leftWeight, rightWeight } = this.calculateWeights();
        
        this.next_weight_stat.textContent = this.next_weight + ' kg';
        this.seesaw_angle.textContent = this.plank_angle.toFixed(1) + '°';
        this.right_side_weight.textContent = rightWeight + ' kg';
        this.left_side_weight.textContent = leftWeight + ' kg';
    }

    animate() {

        this.calculatePlankAngle();
        this.updateVisuals();
        this.updateStats();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SeesawSim();
});
