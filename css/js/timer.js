class QuizTimer {
    constructor(duration = 30) {
        this.totalDuration = duration;
        this.remainingTime = duration;
        this.isRunning = false;
        this.intervalId = null;
        this.onTick = null;
        this.onTimeUp = null;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.remainingTime--;

            if (this.onTick) {
                this.onTick(this.remainingTime);
            }

            if (this.remainingTime <= 0) {
                this.stop();
                if (this.onTimeUp) {
                    this.onTimeUp();
                }
            }
        }, 1000);
    }

    stop() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    reset(newDuration = null) {
        this.stop();
        if (newDuration) {
            this.totalDuration = newDuration;
        }
        this.remainingTime = this.totalDuration;
    }

    getFormattedTime() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}
