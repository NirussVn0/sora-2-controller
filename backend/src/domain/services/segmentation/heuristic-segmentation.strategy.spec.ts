import { HeuristicSegmentationStrategy } from '../../../infrastructure/segmentation/heuristic-segmentation.strategy';

describe('HeuristicSegmentationStrategy', () => {
  it('generates one segment per frame', async () => {
    const strategy = new HeuristicSegmentationStrategy();
    const segments = await strategy.generateSegments({ prompt: 'One. Two. Three.', frameCount: 3 });

    expect(segments).toHaveLength(3);
    expect(segments[0]).toContain('Segment 1');
  });
});
