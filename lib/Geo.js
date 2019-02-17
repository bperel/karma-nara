import geolib from 'geolib';
import Coordinates from '../constants/Coordinates';
import Colors from '../constants/Colors';

const distanceThresholds = [
    {
        distance: 500,
        color: Colors.closeDistance
    },
    {
        distance: 1000,
        color: Colors.notTooFarDistance
    },
    {
        distance: Infinity,
        color: Colors.farDistance
    }
];

const getDistanceFromKarmaHQ = coordinates => (
    geolib.getDistance(
        coordinates,
        Coordinates.karmaCoordinates
    )
);

const getProximityStyle = distance => {
    for (let threshold of distanceThresholds) {
        if (distance <= threshold.distance) {
            return { color: threshold.color };
        }
    }
};

export default { getDistanceFromKarmaHQ, getProximityStyle };