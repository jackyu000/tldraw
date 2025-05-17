import { useCallback } from 'react';
import { Tldraw, Editor, createShapeId, AssetRecordType, toRichText } from '@tldraw/tldraw';
import type { TLParentId, TLTextShape } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

// Import sample data array
import { sampleDataArray } from './sampleData';


// Helper to check if a string is an image URL
const isImageUrl = (key: string, value: any): boolean => {
  if (typeof value !== 'string') return false;
  const imageKeys = ['image', 'thumbnail', 'photo', 'avatar', 'logo'];
  return (
    imageKeys.some(k => key.toLowerCase().includes(k)) ||
    /\.(jpe?g|png|gif|svg|webp|bmp)$/i.test(value)
  );
};

// Function to recursively add shapes to the editor
const addShapesFromData = (
  editor: Editor,
  data: any,
  parentId: TLParentId | undefined,
  x: number = 0,
  y: number = 0,
  depth: number = 0
) => {
  if (data === null || data === undefined) return;

  const isArray = Array.isArray(data);
  const isObject = typeof data === 'object' && !isArray;
  const isPrimitive = !isObject && !isArray;

  // Create a frame for the current data item
  const frameId = createShapeId();
  
  // Create frame shape with supported properties
  editor.createShape({
    type: 'frame',
    id: frameId,
    x,
    y,
    props: {
      name: isArray ? 'Array' : isObject ? 'Object' : String(data),
      w: 300,
      h: isPrimitive ? 40 : 100,
    },
    parentId,
  });

  if (isPrimitive) {
    if (typeof data === 'string' && isImageUrl('', data)) {
      // Handle image URLs based on the examples provided
      try {
        const imageWidth = 200;
        const imageHeight = 200;
        
        // Create a unique ID for the asset
        const assetId = AssetRecordType.createId();
        
        // Create the asset with the image URL
        editor.createAssets([
          {
            id: assetId,
            type: 'image',
            typeName: 'asset',
            props: {
              name: 'external-image.png',
              src: data,
              w: imageWidth,
              h: imageHeight,
              mimeType: 'image/png',
              isAnimated: false,
            },
            meta: {},
          },
        ]);
        
        // Create the image shape referencing the asset
        editor.createShape({
          type: 'image',
          id: createShapeId(),
          x: x + 10,
          y: y + 10,
          props: {
            assetId,
            w: imageWidth,
            h: imageHeight,
          },
          parentId: frameId,
        });
      } catch (error) {
        console.error('Error creating image shape:', error);
        // Fallback to text if image loading fails
        editor.createShape<TLTextShape>({
          type: 'text',
          id: createShapeId(),
          x: x + 10,
          y: y + 10,
          props: {
            richText: toRichText(`[Image: ${data}]`),
            color: 'red',
            size: 'm',
            font: 'draw',
            textAlign: 'start',
            autoSize: true,
          },
          parentId: frameId,
        });
      }
    } else {
      // For non-image primitive values, add a text shape
      editor.createShape<TLTextShape>({
        type: 'text',
        id: createShapeId(),
        x: x + 10,
        y: y + 10,
        props: {
          richText: toRichText(String(data)),
          color: 'black',
          size: 'm',
          font: 'draw',
          textAlign: 'start',
          autoSize: true,
        },
        parentId: frameId,
      });
    }
  } else {
    // For objects and arrays, recursively add shapes for each property
    let currentY = y + 40; // Start below the frame title
    
    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      
      const value = data[key];
      const isNested = typeof value === 'object' && value !== null;
      
      // Add key label
      editor.createShape<TLTextShape>({
        type: 'text',
        id: createShapeId(),
        x: x + 10 + (depth * 20),
        y: currentY,
        props: {
          richText: toRichText(`${key}:`),
          color: 'black',
          size: 'm',
          font: 'draw',
          textAlign: 'start',
          autoSize: true,
        },
        parentId: frameId,
      });

      if (isNested) {
        // Recursively add nested data
        const childFrameId = addShapesFromData(editor, value, frameId, x + 120 + (depth * 20), currentY, depth + 1);
        
        // If we have an actual frame ID, adjust the vertical position
        if (childFrameId) {
          currentY += 100; // Adjust based on content height
        }
      } else if (isImageUrl(key, value)) {
        // Handle image URLs in object properties
        try {
          const imageWidth = 200;
          const imageHeight = 200;
          const assetId = AssetRecordType.createId();
          
          // Create the asset
          editor.createAssets([
            {
              id: assetId,
              type: 'image',
              typeName: 'asset',
              props: {
                name: `${key}-image.png`,
                src: value,
                w: imageWidth,
                h: imageHeight,
                mimeType: 'image/png',
                isAnimated: false,
              },
              meta: {},
            },
          ]);
          
          // Create the image shape
          editor.createShape({
            type: 'image',
            id: createShapeId(),
            x: x + 120 + (depth * 20),
            y: currentY,
            props: {
              assetId,
              w: imageWidth,
              h: imageHeight,
            },
            parentId: frameId,
          });
          
          currentY += imageHeight + 10;
        } catch (error) {
          console.error(`Error creating image shape for ${key}:`, error);
          // Fallback to text if image loading fails
          const valueText = typeof value === 'string' ? `"${value}"` : String(value);
          editor.createShape<TLTextShape>({
            type: 'text',
            id: createShapeId(),
            x: x + 120 + (depth * 20),
            y: currentY,
            props: {
              richText: toRichText(valueText),
              color: 'blue',
              size: 'm',
              font: 'mono',
              textAlign: 'start',
              autoSize: true,
            },
            parentId: frameId,
          });
          currentY += 30;
        }
      } else {
        // Add primitive value
        const valueText = typeof value === 'string' ? `"${value}"` : String(value);
        editor.createShape<TLTextShape>({
          type: 'text',
          id: createShapeId(),
          x: x + 120 + (depth * 20),
          y: currentY,
          props: {
            richText: toRichText(valueText),
            color: 'blue',
            size: 'm',
            font: 'mono',
            textAlign: 'start',
            autoSize: true,
          },
          parentId: frameId,
        });
        currentY += 30;
      }
    }

    // Update frame size based on content
    editor.updateShape({
      id: frameId,
      type: 'frame',
      props: {
        w: 300,
        h: Math.max(currentY - y + 20, 100), // Ensure minimum height
      },
    });
    
    return frameId;
  }
};

function App() {
  // Handle editor mount
  const handleMount = useCallback((editor: Editor) => {
    // Clear any existing content
    const shapes = editor.getCurrentPageShapes();
    if (shapes.length > 0) {
      editor.deleteShapes(shapes.map(shape => shape.id));
    }
    
    // Get the current page ID
    const pageId = editor.getCurrentPageId() as TLParentId;
    
    // Calculate starting positions for records in a grid layout
    const rowHeight = 500; // Height estimate for each record
    const columnWidth = 400; // Width estimate for each record
    const recordsPerRow = 2; // Number of records per row
    
    // Add all sample records to the canvas
    sampleDataArray.forEach((record, index) => {
      // Calculate position in grid
      const row = Math.floor(index / recordsPerRow);
      const col = index % recordsPerRow;
      const x = 50 + (col * columnWidth);
      const y = 50 + (row * rowHeight);
      
      // Visualize this record
      addShapesFromData(editor, record, pageId, x, y);
    });
    
    // Zoom to fit all content
    editor.zoomToFit();
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}>
      <Tldraw 
        onMount={handleMount}
        autoFocus={true}
      >
        {/* You can add custom UI components here */}
      </Tldraw>
    </div>
  );
}

export default App;
