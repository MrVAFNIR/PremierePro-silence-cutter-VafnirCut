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

// --- РЕЖИМ 1: RIPPLE DELETE (Работает быстро и тихо) ---
function liveCutRipple(gapsJson, clipOffset) {
    try {
        var gaps = eval("(" + gapsJson + ")");
        var seq = app.project.activeSequence;
        app.enableQE();
        var qeSeq = qe.project.getActiveSequence();
        
        for (var v = 0; v < seq.videoTracks.numTracks; v++) seq.videoTracks[v].setTargeted(true, true);
        for (var a = 0; a < seq.audioTracks.numTracks; a++) seq.audioTracks[a].setTargeted(true, true);

        for (var i = gaps.length - 1; i >= 0; i--) {
            seq.setInPoint(parseFloat(clipOffset) + parseFloat(gaps[i].start));
            seq.setOutPoint(parseFloat(clipOffset) + parseFloat(gaps[i].end));
            qeSeq.extract(); 
        }

        seq.setInPoint(clipOffset); seq.setOutPoint(clipOffset);
        return "SUCCESS";
    } catch(e) { return "ERROR JSX: " + e.message; }
}

// --- РЕЖИМ 2: ПОДГОТОВКА ДЛЯ БОТА (Без псевдо-команд) ---
function setTargetsForLift(trackIdx) {
    try {
        var seq = app.project.activeSequence;
        
        for (var v = 0; v < seq.videoTracks.numTracks; v++) {
            seq.videoTracks[v].setTargeted(false, true);
        }
        for (var a = 0; a < seq.audioTracks.numTracks; a++) {
            var isT = (a === parseInt(trackIdx));
            seq.audioTracks[a].setTargeted(isT, true);
        }
        
        app.project.activeSequence = seq; 
        return "SUCCESS";
    } catch(e) { return "ERROR: " + e.message; }
}

function setInOutAndDeselect(start, end) {
    try {
        var seq = app.project.activeSequence;
        var sel = seq.getSelection();
        
        // Снимаем выделение со всех клипов, чтобы Delete удалял только дырку по In/Out
        if (sel) {
            for(var i=0; i<sel.length; i++) sel[i].setSelected(0, 0);
        }
        seq.setInPoint(start);
        seq.setOutPoint(end);
        
        return "SUCCESS";
    } catch(e) { return "ERROR: " + e.message; }
}

function resetAfterLift(clipOffset) {
    try {
        var seq = app.project.activeSequence;
        for (var v = 0; v < seq.videoTracks.numTracks; v++) seq.videoTracks[v].setTargeted(true, true);
        for (var a = 0; a < seq.audioTracks.numTracks; a++) seq.audioTracks[a].setTargeted(true, true);
        seq.setInPoint(clipOffset);
        seq.setOutPoint(clipOffset);
        return "SUCCESS";
    } catch(e) { return "ERROR: " + e.message; }
}