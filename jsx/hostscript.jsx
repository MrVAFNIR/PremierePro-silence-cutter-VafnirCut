function getActiveClipData() {
    try {
        var seq = app.project.activeSequence;
        if (!seq) return "ERROR: Нет активной секвенции.";
        var selection = seq.getSelection();
        if (!selection || selection.length === 0) return "ERROR: Выдели клип на таймлайне мышкой.";
        var clip = selection[0];
        if (!clip.projectItem) return "ERROR: У выделенного клипа нет связи с файлом.";
        var path = clip.projectItem.getMediaPath();
        if (!path) return "ERROR: Не удалось получить путь.";
        return path + "|||" + clip.start.seconds;
    } catch (e) { return "ERROR JSX: " + e.message; }
}

function importAndCleanXML(xmlPath, allowedTracksStr) {
    try {
        var project = app.project;
        var f = new File(xmlPath);
        if (!f.exists) return "ERROR: XML файл не найден.";

        var oldSeqIds = [];
        for (var s = 0; s < project.sequences.numSequences; s++) {
            oldSeqIds.push(project.sequences[s].sequenceID);
        }

        project.importFiles([f.fsName], true, project.rootItem, false);
        $.sleep(1000); 

        var newSeq = null;
        for (var s = 0; s < project.sequences.numSequences; s++) {
            var isOld = false;
            for (var j = 0; j < oldSeqIds.length; j++) {
                if (project.sequences[s].sequenceID === oldSeqIds[j]) {
                    isOld = true; break;
                }
            }
            if (!isOld) { newSeq = project.sequences[s]; break; }
        }

        if (!newSeq) return "ERROR: Premiere не смог создать секвенцию из XML.";
        project.openSequence(newSeq.sequenceID);
        var seq = project.activeSequence;

        var allowed = allowedTracksStr.split(',');
        var allowedIndexes = [];
        for (var k = 0; k < allowed.length; k++) allowedIndexes.push(parseInt(allowed[k], 10));

        for (var a = 0; a < seq.audioTracks.numItems; a++) {
            var isAllowed = false;
            for (var i = 0; i < allowedIndexes.length; i++) {
                if (allowedIndexes[i] === a) { isAllowed = true; break; }
            }
            if (!isAllowed) {
                var track = seq.audioTracks[a];
                for (var j = track.clips.numItems - 1; j >= 0; j--) {
                    track.clips[j].remove(0, 0); 
                }
            }
        }
        return "SUCCESS";
    } catch (e) {
        return "ERROR JSX: " + e.message;
    }
}