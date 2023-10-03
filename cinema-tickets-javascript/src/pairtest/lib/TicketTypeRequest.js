/**
 * Immutable Object.
 */

import InvalidTicketTypeException from './InvalidTicketTypeException'

export default class TicketTypeRequest {
  #type

  #noOfTickets
  static #VALID_TYPES = ['ADULT', 'CHILD', 'INFANT']

  constructor(type, noOfTickets) {
    if (!TicketTypeRequest.#VALID_TYPES.includes(type)) {
      throw new InvalidTicketTypeException(
        `Invalid ticket type. Allowed types are: ${TicketTypeRequest.#VALID_TYPES.join(
          ', '
        )}`
      )
    }

    if (!Number.isInteger(noOfTickets) || noOfTickets <= 0) {
      throw new TypeError('noOfTickets must be a positive integer')
    }

    this.#type = type
    this.#noOfTickets = noOfTickets
  }

  getNoOfTickets() {
    return this.#noOfTickets
  }

  getTicketType() {
    return this.#type
  }
}
