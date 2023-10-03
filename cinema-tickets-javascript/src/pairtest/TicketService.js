import TicketTypeRequest from './lib/TicketTypeRequest.js'
import InvalidPurchaseException from './lib/InvalidPurchaseException.js'

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #ticketPaymentService
  #seatReservationService

  constructor(ticketPamentService, seatReservationService) {
    this.#ticketPaymentService = ticketPamentService
    this.#seatReservationService = seatReservationService
  }

  #validateRequests(requests) {
    const totalTickets = requests.reduce(
      (sum, req) => sum + req.getNoOfTickets(),
      0
    )

    if (totalTickets > 20) {
      throw new InvalidPurchaseException(
        'Cannot purchase more than 20 tickets at once.'
      )
    }

    const adultTickets =
      requests
        .find((req) => req.getTicketType() === 'ADULT')
        ?.getNoOfTickets() || 0
    if (adultTickets === 0 && totalTickets > 0) {
      throw new InvalidPurchaseException(
        'Child or Infant tickets cannot be purchased without an Adult ticket.'
      )
    }
  }
  #calculateTotalCost(req) {
    return req.reduce((sum, req) => {
      if (req.getTicketType() === 'ADULT')
        return sum + 20 * req.getNoOfTickets()
      if (req.getTicketType() === 'CHILD')
        return sum + 10 * req.getNoOfTickets()
      return sum
    }, 0)
  }

  #calculateTotalSeatsToReserve(req) {
    return req.reduce((sum, req) => {
      if (req.getTicketType() !== 'INFANT') return sum + req.getNoOfTickets()
      return sum
    }, 0)
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (accountId <= 0) {
      throw new InvalidPurchaseException('Invalid accountId')
    }

    this.#validateRequests(ticketTypeRequests)
    const totalCost = this.#calculateTotalCost(ticketTypeRequests)
    this.#ticketPaymentService.makePayment(accountId, totalCost)

    const totalSeats = this.#calculateTotalSeatsToReserve(ticketTypeRequests)
    this.#seatReservationService.reserveSeats(accountId, totalSeats)
  }
}
