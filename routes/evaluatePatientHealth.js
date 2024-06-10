async function evaluatePatientHealth({ oxygen_saturation, respiration_rate, heart_rate, temperature }) {
    let status = '안전';

    if (oxygen_saturation < 90 || respiration_rate < 12 || respiration_rate > 30 || heart_rate < 60 || heart_rate > 120 || temperature < 36.0 || temperature > 38.0) {
        status = '위험';
    } else if (oxygen_saturation < 95 || respiration_rate < 12 || respiration_rate > 20 || heart_rate < 60 || heart_rate > 100 || temperature < 36.5 || temperature > 37.5) {
        status = '주의';
    }

    return status;
}

module.exports = evaluatePatientHealth;
