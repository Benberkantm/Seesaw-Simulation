class SeesawSimulation {
    constructor() {
        this.halfPlankLength = 260;
        this.maxPlankAngle = 30;
        this.plankAngle = 0;
        this.objects = [];
        
        this.container = document.getElementById('seesawContainer');
        this.plank = document.getElementById('seesawPlank');
        this.nextWeight = this.generateNextWeight();
        
        this.init();
    }

    init() {
        this.container.addEventListener('click', (e) => this.handleClick(e));
        this.animate();
    }

    generateNextWeight() {
        return Math.floor(Math.random() * 10) + 1;
    }

    getObjectPosition(distanceFromPivot) {
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        const pivotX = containerWidth / 2;
        const pivotY = containerHeight / 2;
        const angleRad = (this.plankAngle * Math.PI) / 180;

        return {
            x: pivotX + (distanceFromPivot * Math.cos(angleRad)),
            y: pivotY + (distanceFromPivot * Math.sin(angleRad)) - 15
        };
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

    animate() {
        this.updatePhysics();
        this.updateVisuals();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SeesawSimulation();
});
