import TicketService from '../src/pairtest/TicketService'
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest'
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException'

const mockPaymentService = {
  makePayment: jest.fn(),
}

const mockReservationService = {
  reserveSeats: jest.fn(),
}

describe('TicketService', () => {
  let ticketService

  beforeEach(() => {
    ticketService = new TicketService(
      mockPaymentService,
      mockReservationService
    )
    mockPaymentService.makePayment.mockClear()
    mockReservationService.reserveSeats.mockClear()
  })

  it('should throw when total tickets exceed 20', () => {
    const ticketReq = new TicketTypeRequest('ADULT', 21)
    expect(() => ticketService.purchaseTickets(1, ticketReq)).toThrow(
      new InvalidPurchaseException(
        'Cannot purchase more than 20 tickets at once.'
      )
    )
  })

  it('should throw when purchasing child or infant tickets without an adult', () => {
    const childTicketReq = new TicketTypeRequest('CHILD', 5)
    const infantTicketReq = new TicketTypeRequest('INFANT', 5)
    expect(() => ticketService.purchaseTickets(1, childTicketReq)).toThrow(
      new InvalidPurchaseException(
        'Child or Infant tickets cannot be purchased without an Adult ticket.'
      )
    )
    expect(() => ticketService.purchaseTickets(1, infantTicketReq)).toThrow(
      new InvalidPurchaseException(
        'Child or Infant tickets cannot be purchased without an Adult ticket.'
      )
    )
  })

  it('should make correct payment for adult tickets', () => {
    const ticketReq = new TicketTypeRequest('ADULT', 5)
    ticketService.purchaseTickets(1, ticketReq)
    expect(mockPaymentService.makePayment).toHaveBeenCalledWith(1, 100)
  })

  it('should make correct payment for child tickets', () => {
    const adultTicketReq = new TicketTypeRequest('ADULT', 1)
    const childTicketReq = new TicketTypeRequest('CHILD', 2)
    ticketService.purchaseTickets(1, adultTicketReq, childTicketReq)
    expect(mockPaymentService.makePayment).toHaveBeenCalledWith(1, 40)
  })

  it('should not reserve seats for infants', () => {
    const adultTicketReq = new TicketTypeRequest('ADULT', 1)
    const infantTicketReq = new TicketTypeRequest('INFANT', 2)
    ticketService.purchaseTickets(1, adultTicketReq, infantTicketReq)
    expect(mockReservationService.reserveSeats).toHaveBeenCalledWith(1, 1)
  })
})
