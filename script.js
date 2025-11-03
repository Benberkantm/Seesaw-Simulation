class SeesawSimulation {
    constructor() {
        this.Plank_Length = 260;
        this.max_Plank_Angle = 30;
        this.plank_Angle = 0;
        this.objects = [];
        
        this.seesaw_screen = document.getElementById('seesawContainer');
        this.seesaw_plank = document.getElementById('seesawPlank');
        this.next_Weight = this.generateNextWeight();

        this.seesaw_angle = document.getElementById('angle');
        this.right_side_weight = document.getElementById('rightWeight');
        this.left_side_weight = document.getElementById('leftWeight');
        this.next_weight_stat = document.getElementById('nextWeightStat');

        this.loadState();
        this.init();
    }

    init() {
        this.container.addEventListener('click', (e) => this.handleClick(e));
        this.animate();
    }

    generateNextWeight() {
        return Math.floor(Math.random() * 10) + 1;
    }

    saveState() {
        let savedObjects = [];
        for (let i = 0; i < this.objects.length; i++) {
            savedObjects.push({
                distanceFromPivot: this.objects[i].distanceFromPivot,
                weight: this.objects[i].weight,
                size: this.objects[i].size
            });
        }
        localStorage.setItem('backup', JSON.stringify({objects: savedObjects}));
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

    getObjectPosition(dist) {
        let cw = this.container.offsetWidth;
        let ch = this.container.offsetHeight;
        let px = cw / 2;
        let py = ch / 2;
        let rad = this.plankAngle * Math.PI / 180;

        let posX = px + dist * Math.cos(rad);
        let posY = py + dist * Math.sin(rad) - 15;
        
        return { x: posX, y: posY };
    }

    handleClick(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
            return;
        }

        const pivotX = rect.width / 2;
        const pivotY = rect.height / 2;
        const clickX = x - pivotX;
        const clickY = y - pivotY;

        const angleRad = (this.plankAngle * Math.PI) / 180;
        const plankX = clickX * Math.cos(-angleRad) - clickY * Math.sin(-angleRad); 
        const distanceFromPivot = plankX;

        if (Math.abs(distanceFromPivot) > this.halfPlankLength) {
            return;
        }

        const weight = this.nextWeight;
        this.addObject(distanceFromPivot, weight);
        this.nextWeight = this.generateNextWeight();
    }

    addObject(distanceFromPivot, weight) {
        const size = 10 + weight * 4;
        const { x, y } = this.getObjectPosition(distanceFromPivot);

        const element = document.createElement('div');
        element.className = 'object';
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.left = (x - size / 2) + 'px';
        element.style.top = (y - size / 2) + 'px';
        element.textContent = weight + 'kg';
        this.container.appendChild(element);

        this.objects.push({
            distanceFromPivot: distanceFromPivot,
            weight: weight,
            size: size,
            element: element
        });
        
        this.saveState();
    }

    calculateTorque() {
        let leftTorque = 0;
        let rightTorque = 0;

        this.objects.forEach(obj => {
            const torque = obj.weight * obj.distanceFromPivot;
            
            if (obj.distanceFromPivot < 0) {
                leftTorque += Math.abs(torque);
            } else {
                rightTorque += torque;
            }

        });

        return { leftTorque, rightTorque };
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

    updatePhysics() {
        const { leftTorque, rightTorque } = this.calculateTorque();
        this.plankAngle = Math.max(-this.maxPlankAngle, Math.min(this.maxPlankAngle, (rightTorque - leftTorque) / 10));
    }

    updateVisuals() {
        this.plank.style.transform = `translateX(-50%) translateY(-50%) rotate(${this.plankAngle}deg)`;

        this.objects.forEach(obj => {
            const { x, y } = this.getObjectPosition(obj.distanceFromPivot);

            obj.element.style.left = (x - obj.size / 2) + 'px';
            obj.element.style.top = (y - obj.size / 2) + 'px';
            
        });

    }

    updateStats() {
        const { leftWeight, rightWeight } = this.calculateWeights();
        
        this.nextWeightStat.textContent = this.nextWeight + ' kg';
        this.angle.textContent = this.plankAngle.toFixed(1) + '°';
        this.rightWeight.textContent = rightWeight + ' kg';
        this.leftWeight.textContent = leftWeight + ' kg';
    }

    animate() {
        this.updatePhysics();
        this.updateVisuals();
        this.updateStats();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SeesawSimulation();
});
