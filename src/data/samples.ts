import type { Report, ReportStatus } from '../types';

function sample(
  id: string,
  title: string,
  category: Report['category'],
  location: string,
  description: string,
  status: ReportStatus,
  createdAt: string,
  changes: Array<{ timestamp: string; status: ReportStatus }> = [],
): Report {
  const history: Report['history'] = [
    { id: `${id}-submitted`, type: 'submitted', timestamp: createdAt, status: 'Pending' },
    ...changes.map((change, index) => ({
      id: `${id}-update-${index + 1}`,
      type: 'status' as const,
      timestamp: change.timestamp,
      status: change.status,
      previousStatus: index === 0 ? 'Pending' as ReportStatus : changes[index - 1].status,
    })),
  ];
  return {
    id,
    title,
    category,
    location,
    description,
    status,
    createdAt,
    updatedAt: changes.at(-1)?.timestamp ?? createdAt,
    history,
  };
}

export const SAMPLE_REPORTS: Report[] = [
  sample('WW-2601', 'Overflowing bins near the market entrance', 'Waste Management', 'Maple Street market, east gate', 'The public bins beside the east entrance have been full since the weekend. Loose waste is collecting around the pavement and could use a pickup.', 'Pending', '2026-10-11T08:40:00.000Z'),
  sample('WW-2602', 'Water pooling beside the community tap', 'Water Supply & Leakage', 'Cedar Lane community tap', 'A steady drip continues from the pipe joint below the tap, leaving a slippery patch on the walkway. It appears to be a small but persistent leak.', 'In Progress', '2026-10-09T11:15:00.000Z', [{ timestamp: '2026-10-10T09:25:00.000Z', status: 'In Progress' }]),
  sample('WW-2603', 'Uneven paving stones on the library path', 'Roads & Footpaths', 'Public library, south approach', 'Several paving stones have lifted along the path to the south entrance. The uneven section is difficult to pass, especially after dark.', 'Pending', '2026-10-08T15:05:00.000Z'),
  sample('WW-2604', 'Streetlight not working at the corner', 'Streetlights', 'Pine Road and Second Avenue', 'The lamp at the north-east corner has been out for a few evenings. The crossing is quite dim once the shops close.', 'Resolved', '2026-10-06T18:30:00.000Z', [{ timestamp: '2026-10-07T08:10:00.000Z', status: 'In Progress' }, { timestamp: '2026-10-10T16:45:00.000Z', status: 'Resolved' }]),
  sample('WW-2605', 'Blocked drain after recent rain', 'Drainage & Sanitation', 'Willow Court, beside building 4', 'Rainwater is draining slowly through the covered channel near building 4. Leaves and silt are visible at the grate.', 'In Progress', '2026-10-04T07:55:00.000Z', [{ timestamp: '2026-10-05T10:20:00.000Z', status: 'In Progress' }]),
  sample('WW-2606', 'Loose cover on the footpath utility box', 'Other', 'Oak Park, western walking loop', 'The small utility cover beside the walking path shifts when stepped near. Please check that it is seated securely.', 'Pending', '2026-10-02T13:00:00.000Z'),
  sample('WW-2607', 'Low water pressure in the evening', 'Water Supply & Leakage', 'Birch Row, houses 12–18', 'Residents along this stretch have noticed reduced pressure at the taps during the evening. The flow returns to normal later at night.', 'Resolved', '2026-09-29T17:10:00.000Z', [{ timestamp: '2026-09-30T08:35:00.000Z', status: 'In Progress' }, { timestamp: '2026-10-03T12:15:00.000Z', status: 'Resolved' }]),
  sample('WW-2608', 'Broken paving beside the bus shelter', 'Roads & Footpaths', 'Elm Avenue bus shelter', 'A shallow section of paving has broken beside the shelter entrance. The exposed edge catches on shoes and makes the waiting area awkward to access.', 'In Progress', '2026-09-27T10:25:00.000Z', [{ timestamp: '2026-09-29T14:50:00.000Z', status: 'In Progress' }]),
];
