import Ride from "./Ride";

export default abstract class RideStatus {
  abstract value: string;

  constructor (readonly ride: Ride) {}

  abstract request (): void;
  abstract accept (): void;
  abstract start (): void;
}

export class RequestedStatus extends RideStatus {
  value: string;

  constructor (ride: Ride) {
    super(ride);
    this.value = "requested";
  }

  request (): void {
    throw new Error("Invalid status");
  }

  accept (): void {
    this.ride.status = new AcceptedStatus(this.ride);
  }

  start (): void {
    throw new Error("Invalid status");
  }
}

export class AcceptedStatus extends RideStatus {
  value: string;

  constructor (ride: Ride) {
    super(ride);
    this.value = "accepted";
  }

  request (): void {
    throw new Error("Invalid status");
  }

  accept (): void {
    throw new Error("Invalid status");
  }

  start (): void {
    this.ride.status = new InProgressStatus(this.ride);
  }
}

export class InProgressStatus extends RideStatus {
  value: string;

  constructor (ride: Ride) {
    super(ride);
    this.value = "in_progress";
  }

  request (): void {
    throw new Error("Invalid status");
  }

  accept (): void {
    throw new Error("Invalid status");
  }

  start (): void {
    throw new Error("Invalid status");
  }
}

export class RideStatusFactory {
  static create (type: string, ride: Ride): RideStatus {
    switch (type) {
      case "requested":
        return new RequestedStatus(ride);
      case "accepted":
        return new AcceptedStatus(ride);
      case "in_progress":
        return new InProgressStatus(ride);
      default:
        throw new Error();
    }
  }
}