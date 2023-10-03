import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest'
import InvalidTicketTypeException from '../src/pairtest/lib/InvalidTicketTypeException'

describe('TicketService', () => {
  it('should throw an error for invalid ticket type', () => {
    expect(() => new TicketTypeRequest('TEENAGER', 5)).toThrow(
      new InvalidTicketTypeException(
        'Invalid ticket type. Allowed types are: ADULT, CHILD, INFANT'
      )
    )
  })

  it('should throw an error for an invalid ticket quantity', () => {
    expect(() => new TicketTypeRequest('ADULT', '5')).toThrow(
      'noOfTickets must be a positive integer'
    )
    expect(() => new TicketTypeRequest('ADULT', 7.5)).toThrow(
      'noOfTickets must be a positive integer'
    )
    expect(() => new TicketTypeRequest('ADULT', 0)).toThrow(
      'noOfTickets must be a positive integer'
    )
    expect(() => new TicketTypeRequest('ADULT', -3)).toThrow(
      'noOfTickets must be a positive integer'
    )
  })
  it('should create a vaid TicketTypeRequest', () => {
    const ticketReq = new TicketTypeRequest('CHILD', 2)
    expect(ticketReq.getTicketType()).toBe('CHILD')
    expect(ticketReq.getNoOfTickets()).toBe(2)
  })
})
