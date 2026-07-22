// WebGL2 컨텍스트 + 웹캠 텍스처 업로드 유틸 (SPEC §3)
// 텍스처는 최초 1회만 할당하고 매 프레임 texSubImage2D로 재사용 (SPEC §7)

export interface GlContext {
  gl: WebGL2RenderingContext;
  /** 웹캠 프레임 텍스처 — uploadVideo() 호출로 갱신된다 */
  videoTex: WebGLTexture;
  /** 매 프레임 호출. 비디오 해상도가 바뀐 경우에만 재할당한다. */
  uploadVideo(video: HTMLVideoElement): void;
  dispose(): void;
}

export function createGlContext(canvas: HTMLCanvasElement): GlContext | null {
  // preserveDrawingBuffer: 스냅샷(toBlob)을 렌더 직후가 아니어도 캡처 가능하게
  const gl = canvas.getContext('webgl2', {
    preserveDrawingBuffer: true,
    antialias: false,
    alpha: false,
  });
  if (!gl) return null;

  const videoTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, videoTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  let texW = 0;
  let texH = 0;

  return {
    gl,
    videoTex,

    uploadVideo(video: HTMLVideoElement) {
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w === 0 || h === 0) return;
      gl.bindTexture(gl.TEXTURE_2D, videoTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      if (w !== texW || h !== texH) {
        texW = w;
        texH = h;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      } else {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, video);
      }
    },

    dispose() {
      gl.deleteTexture(videoTex);
    },
  };
}
