export class StoreStatus {
  isReseting: boolean;
  isLoaded: boolean;
  hasError: boolean;

  constructor(isReseting: boolean, isLoaded: boolean, hasError: boolean) {
    this.isReseting = isReseting || false;
    this.isLoaded = isLoaded || false;
    this.hasError = hasError || false;
  }
}
