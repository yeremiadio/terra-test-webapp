export class ROUTES {
  static get base() {
    return `/` as const;
  }
  static get fleet() {
    return `/fleet` as const;
  }
  static get fuelHistory() {
    return `/fuel-history` as const;
  }
  static get reminders() {
    return `/reminders` as const;
  }
  static get reports() {
    return `/reports` as const;
  }
  static fleetById(id: string) {
    return `/fleet/${id}` as const;
  }
}
