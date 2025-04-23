/**
 * @jest-environment jsdom
 */

import { fetchWeather } from './script'; // Export fetchWeather in script.js for testing

global.fetch = jest.fn();

describe('fetchWeather', () => {
  beforeEach(() => {
    fetch.mockClear();
    document.body.innerHTML = '<div id="weatherResult"></div>';
  });

  it('displays error message if city is empty', () => {
    fetchWeather('');
    const resultDiv = document.getElementById('weatherResult');
    expect(resultDiv.innerHTML).toContain('Please enter a city name');
  });

  it('fetches weather data and displays it', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        name: 'Test City',
        main: { temp: 20 },
        weather: [{ description: 'clear sky', icon: '01d' }]
      }),
    };
    fetch.mockResolvedValue(mockResponse);

    await fetchWeather('Test City');

    const resultDiv = document.getElementById('weatherResult');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('Test City'));
    expect(resultDiv.innerHTML).toContain('Test City');
    expect(resultDiv.innerHTML).toContain('clear sky');
    expect(resultDiv.innerHTML).toContain('20 °C');
  });

  it('displays error message on fetch failure', async () => {
    fetch.mockResolvedValue({ ok: false });
    await fetchWeather('InvalidCity');
    const resultDiv = document.getElementById('weatherResult');
    expect(resultDiv.innerHTML).toContain('Error');
  });
});
