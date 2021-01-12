class PriorityQueue {

    constructor() {
        this.entities = [];
    };

    // Adds an entitiy to the Priority Queue
    enqueue(entity) {
        this.entities.push(entity);
        this.bubbleUp();
        return this.entities;
    };

    // Removes an entitiy to the Priority Queue
    dequeue() {
        this.swap(0, this.entities.length - 1); // swap first and last element

        let poppedEntity = this.entities.pop();

        if (this.entities.length > 1) {
            this.bubbleDown();
        }

        return poppedEntity;

    };

    // Helper method that bubbles up entities from end
    bubbleUp() {
        let index = this.entities.length - 1; // index of last inserted element

        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2); // parent index

            if (this.entities[parentIndex].priority > this.entities[index].priority) {
                this.swap(index, parentIndex);

                index = parentIndex;
            } else {
                break;
            }
        }
        return 0;
    };

    // Helper method that readjusts the queue after dequeue
    bubbleDown() {
        
    };

    // Helper method to swap two indexes
    swap(index1, index2) {
        let temp = this.entities[index1];
        this.entities[index1] = this.entities[index2];
        this.entities[index2] = temp;
        return this.entities;
    };

}