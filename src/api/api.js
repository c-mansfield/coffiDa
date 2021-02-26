import NavigationService from 'src/services/NavigationService';
import DropDownHolder from 'src/services/DropdownHolder.js';

const url = 'http://10.0.2.2:3333/api/1.0.0';

const errorMessages = {
  locationError: 'Location not found',
  serverError: 'Our server is having a break, please try again later!',
  requestError: 'Error making request!',
  badRequest: 'Bad request, please try again!',
  forbiddenRequest: 'Forbidden request',
  reviewError: 'Review not found',
};

const handleUnauthorised = () => {
  NavigationService.navigate('Entry');
  DropDownHolder.error('Error', 'User not authenticated, please log back in and try again!');
};

module.exports = {
  url,
  handleUnauthorised,
  errorMessages,
};
