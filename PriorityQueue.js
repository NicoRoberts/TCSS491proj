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

    // Removes an entitiy from the Priority Queue
    dequeue() {
        this.swap(0, this.entities.length - 1); // swap first and last element

        let poppedEntity = this.entities.pop();

        if (this.entities.length > 1) {
            this.bubbleDown();
        }

        return poppedEntity;

    };

    // Helper method that sorts the heap after an element is added
    bubbleUp() {
        let index = this.entities.length - 1; // index of last inserted element

        // loop while index is not 0 or element no longer needs to bubble
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2); // parent index formula

            // if the priority of parent is greater than new entity, swap the two
            if (this.entities[parentIndex].priority > this.entities[index].priority) {
                this.swap(index, parentIndex);

                index = parentIndex; // update index
            } else {
                break;
            }
        }
        return 0;
    };

    // Helper method that readjusts the heap after dequeue
    bubbleDown() {
        let parentIndex = 0;
        const length = this.entities.length;
        const entityPriority = this.entities[0].priority;

        // loop breaks only if no more swaps are needed
        while (true) {
            // get indexes of child entities
            let leftChildIndex = (2 * parentIndex) + 1;
            let rightChildIndex = (2 * parentIndex) + 2;
            let leftChildPriority, rightChildPriority;
            let indexToSwap = null;

            // if left child exists and is greater than the parent entity, plan to swap with the left child index
            if (leftChildIndex < length){
                leftChildPriority = this.entities[leftChildIndex].priority;
                if (leftChildPriority < entityPriority) {
                    indexToSwap = leftChildIndex;
                }
            }

            // if right child exists
            if(rightChildIndex < length) {
                rightChildPriority = this.entities[rightChildIndex].priority;

                // if right child is greater than the parent entity and there is no plans to swap yet
                // OR if right child is greater than left child and there are plans to swap
                if ( (rightChildPriority < entityPriority && indexToSwap === null) ||
                     (rightChildPriority < leftChildPriority && indexToSwap !== null) ) {
                    
                    // plan to swap with right child index
                    indexToSwap = rightChildIndex;
                }
            }
            // if no more swap are needed, break out of loop
            if (indexToSwap === null) {
                break;
            }
            
            // swap with planned child
            this.swap(parentIndex, indexToSwap);
            // update starting index
            parentIndex = indexToSwap;
        }
    };

    // Helper method to swap two indexes
    swap(index1, index2) {
        let temp = this.entities[index1];
        this.entities[index1] = this.entities[index2];
        this.entities[index2] = temp;
        return this.entities;
    };

}